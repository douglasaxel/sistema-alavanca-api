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
	Put,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { FindAllProjectDto } from './dto/find-all-projects.dto';
import { getProjectTasks } from 'src/utils/airtable-helpers';
import { excludeKeyFromObj } from 'src/utils/exclude-key-from-obj';
import {
	copyFilesToNewFolder,
	createDriveFile,
	createGoogleCalendarEvent,
	listCalendarEvents,
	listDriveFiles,
} from 'src/services/googleapi';
import { CreateCalendarEventDto } from './dto/create-calendar-event.dto';
import { ApiNoContentResponse } from '@nestjs/swagger';
import { CreateCollaboratorDto } from './dto/create-collaborator.dto';
import { UpdateCollaboratorDto } from './dto/update-collaborator.dto';

@Controller('projects')
export class ProjectsController {
	constructor(private readonly projectsService: ProjectsService) {}

	@Post()
	async create(@Body() createProjectDto: CreateProjectDto) {
		const driverFolderId = await createDriveFile(createProjectDto.name);
		await copyFilesToNewFolder(
			'1cURb4T_Tlnz8RVDaOut9IYsBzVmlwa3z', // Pasta: Arquivos padrão
			driverFolderId,
		);
		return this.projectsService.create(createProjectDto, driverFolderId);
	}

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

	@Get()
	async findAll(@Query() findAllProjectDto: FindAllProjectDto) {
		const projects = await this.projectsService.findAll(findAllProjectDto);

		const results = [];
		for (const proj of projects) {
			const tasks = await getProjectTasks(proj.airtableUrl);
			results.push({ ...proj, tasks });
		}

		return results;
	}

	@Get(':id')
	async findOne(@Param('id') id: string) {
		const project = await this.projectsService.findOne(+id);
		if (!project) {
			throw new NotFoundException(['Este projeto não existe']);
		}

		excludeKeyFromObj(project, ['deletedAt']);

		const tasks = await getProjectTasks(project.airtableUrl);
		const googleFiles = await listDriveFiles(project.driveFolderId);
		const googleCalendar = await listCalendarEvents(project.name);

		return {
			...project,
			tasks,
			googleFiles,
			googleCalendar,
		};
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
		return this.projectsService.update(+id, updateProjectDto);
	}

	@Put(':id/collaborators')
	async addCollaborators(
		@Param('id') id: number,
		@Body() createCollaboratorDto: CreateCollaboratorDto,
	) {
		return this.projectsService.createCollaborators(id, createCollaboratorDto);
	}

	@ApiNoContentResponse()
	@Delete(':id/collaborators/:idCollaborator')
	async removeCollaborators(
		@Param('id') id: number,
		@Param('idCollaborator') idCollaborator: number,
	) {
		await this.projectsService.removeCollaborators(id, idCollaborator);
		return null
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.projectsService.remove(+id);
	}
}
