import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Query,
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
	listCalendarEvents,
	listDriveFiles,
} from 'src/services/googleapi';

@Controller('projects')
export class ProjectsController {
	constructor(private readonly projectsService: ProjectsService) {}

	@Post()
	async create(@Body() createProjectDto: CreateProjectDto) {
		const driverFolderId = await createDriveFile(createProjectDto.name);
		await copyFilesToNewFolder(
			'1jEeUHfXIziC99Q-jTWv-p3IFenauMRfz',
			driverFolderId,
		);
		return this.projectsService.create(createProjectDto, driverFolderId);
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
		excludeKeyFromObj(project, ['deletedAt']);

		const tasks = await getProjectTasks(project.airtableUrl);
		const googleFiles = await listDriveFiles(project.driveFolderId);
		const googleCalendar = await listCalendarEvents();

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

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.projectsService.remove(+id);
	}
}
