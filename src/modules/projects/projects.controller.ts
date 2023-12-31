import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Query,
	NotFoundException,
	BadRequestException,
	Inject,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { FindAllProjectDto } from './dto/find-all-projects.dto';
import { getProjectTasks } from 'src/services/airtable';
import { excludeKeyFromObj } from 'src/utils/exclude-key-from-obj';
import {
	copyFilesToNewFolder,
	createDriveFolder,
	createGoogleCalendarEvent,
	listCalendarEvents,
	listDriveFiles,
} from 'src/services/googleapi';
import { CreateCalendarEventDto } from './dto/create-calendar-event.dto';
import { ApiNoContentResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import { UserRoles } from '../roles/roles.enum';
import { getProjectSituation } from 'src/utils/get-project-situation';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

type ICacheProjectTask = {
	todo: number;
	doing: number;
	done: number;
	total: number;
};

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
	constructor(
		private readonly projectsService: ProjectsService,
		@Inject(CACHE_MANAGER) private cacheManager: Cache,
	) {}

	@Roles(UserRoles.ADMIN, UserRoles.MASTER)
	@Post()
	async create(@Body() createProjectDto: CreateProjectDto) {
		const driverFolderId = await createDriveFolder(createProjectDto.name);
		await copyFilesToNewFolder(
			process.env.GOOGLE_DEFAULT_FILES_FOLDER,
			driverFolderId,
		);
		return this.projectsService.create(createProjectDto, driverFolderId);
	}

	@Roles(UserRoles.ADMIN, UserRoles.MASTER)
	@ApiNoContentResponse()
	@Post(':id/event')
	async createEvent(
		@Param('id') id: number,
		@Body() { startDate, endDate }: CreateCalendarEventDto,
	) {
		const project = await this.projectsService.findOne(id);

		if (!project) throw new NotFoundException(['Este projeto não existe']);
		if (endDate <= startDate) {
			throw new BadRequestException([
				'A data final não pode ser anterior a data inicial',
			]);
		}

		const { name, collaborators } = project;

		await createGoogleCalendarEvent(
			name,
			startDate,
			endDate,
			collaborators.map(c => c.email),
			// ['douglasaxelkjellin@gmail.com'],
		);

		return null;
	}

	@Roles(UserRoles.ADMIN, UserRoles.MASTER, UserRoles.CUSTOMER, UserRoles.BASIC)
	@Get()
	async findAll(@Query() findAllProjectDto: FindAllProjectDto) {
		const projects = await this.projectsService.findAll(findAllProjectDto);
		const results = [];

		for (const proj of projects) {
			const cachedTasks: ICacheProjectTask = await this.cacheManager.get(
				`project-tasks-[${proj.id}]`,
			);
			let totalTasks = {
				todo: 0,
				doing: 0,
				done: 0,
				total: 0,
			};
			if (!cachedTasks) {
				for (const link of proj.airtableLinks) {
					const tasks = await getProjectTasks(link.url);
					totalTasks.todo = totalTasks.todo + tasks.todo;
					totalTasks.doing = totalTasks.doing + tasks.doing;
					totalTasks.done = totalTasks.done + tasks.done;
					totalTasks.total = totalTasks.total + tasks.total;
				}
				await this.cacheManager.set(`project-tasks-[${proj.id}]`, totalTasks);
			} else {
				totalTasks = cachedTasks;
			}
			const situation = getProjectSituation({
				startDate: proj.startDate.toISOString(),
				endDate: proj.endDate.toISOString(),
				tasks: {
					total: totalTasks.total,
					done: totalTasks.done,
				},
			});

			results.push({ ...proj, situation, tasks: totalTasks });
		}

		return results.map(p => ({ ...p, airtableLinks: undefined }));
	}

	@Roles(UserRoles.ADMIN, UserRoles.MASTER, UserRoles.CUSTOMER, UserRoles.BASIC)
	@Get(':id')
	async findOne(@Param('id') id: string) {
		const project = await this.projectsService.findOne(+id);
		if (!project) {
			throw new NotFoundException(['Este projeto não existe']);
		}

		excludeKeyFromObj(project, ['deletedAt']);

		const googleFiles = await listDriveFiles(project.driveFolderId);
		const googleCalendar = await listCalendarEvents(project.name);
		const cachedTasks: ICacheProjectTask = await this.cacheManager.get(
			`project-tasks-[${project.id}]`,
		);

		let totalTasks = {
			todo: 0,
			doing: 0,
			done: 0,
			total: 0,
		};
		if (!cachedTasks) {
			for (const link of project.airtableLinks) {
				const tasks = await getProjectTasks(link.url);
				totalTasks.todo = totalTasks.todo + tasks.todo;
				totalTasks.doing = totalTasks.doing + tasks.doing;
				totalTasks.done = totalTasks.done + tasks.done;
				totalTasks.total = totalTasks.total + tasks.total;
			}
			await this.cacheManager.set(`project-tasks-[${project.id}]`, totalTasks);
		} else {
			totalTasks = cachedTasks;
		}

		const situation = getProjectSituation({
			startDate: project.startDate.toISOString(),
			endDate: project.endDate.toISOString(),
			tasks: {
				total: totalTasks.total,
				done: totalTasks.done,
			},
		});

		return {
			...project,
			tasks: totalTasks,
			googleFiles: googleFiles.filter(gf => !gf.name?.includes('conversa')),
			googleCalendar,
			situation,
			airtableUrl: undefined,
			deletedAt: undefined,
		};
	}

	@Roles(UserRoles.ADMIN, UserRoles.MASTER)
	@Patch(':id')
	async update(
		@Param('id') id: string,
		@Body() updateProjectDto: UpdateProjectDto,
	) {
		if (isNaN(+id)) {
			throw new BadRequestException(['O id do projeto não é valido']);
		}
		await this.cacheManager.del(`project-tasks-[${id}]`);
		return this.projectsService.update(+id, updateProjectDto);
	}

	@Roles(UserRoles.ADMIN, UserRoles.MASTER)
	@Delete(':id')
	async remove(@Param('id') id: string) {
		await this.cacheManager.del(`project-tasks-[${id}]`);
		return this.projectsService.remove(+id);
	}
}
