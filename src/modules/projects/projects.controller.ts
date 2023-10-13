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
import * as Airtable from 'airtable';

@Controller('projects')
export class ProjectsController {
	constructor(private readonly projectsService: ProjectsService) {}

	@Post()
	create(@Body() createProjectDto: CreateProjectDto) {
		return this.projectsService.create(createProjectDto);
	}

	@Get()
	async findAll(@Query() findAllProjectDto: FindAllProjectDto) {
		const a = new Airtable({
			apiKey:
				'patda9LbETx4Xb1b1.309a5d81085fc5e97d7a480394025c9df0074a2006969e13b4a36b2e2e08de74',
		}).base('app8EElQ3WwjcyXxL');

		// const allData = await a.table('Table 1').select().all();

		return this.projectsService.findAll(findAllProjectDto);
		// return allData.map(data => data.fields);
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.projectsService.findOne(+id);
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
