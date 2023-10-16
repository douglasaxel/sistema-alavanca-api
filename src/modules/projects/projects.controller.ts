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
import { getDataAirtable } from 'src/utils/get-data-airtable';
import { parseAirtableUrl } from 'src/utils/parse-airtable-url';

@Controller('projects')
export class ProjectsController {
	constructor(private readonly projectsService: ProjectsService) {}

	@Post()
	create(@Body() createProjectDto: CreateProjectDto) {
		return this.projectsService.create(createProjectDto);
	}

	@Get()
	async findAll(@Query() findAllProjectDto: FindAllProjectDto) {
		const projects = await this.projectsService.findAll(findAllProjectDto);

		const results = [];
		for (const proj of projects) {
			const ids = parseAirtableUrl(proj.airtableUrl);
			const result = await getDataAirtable(ids.appId, ids.tableId);
			console.log({ result });
			results.push({ ...proj, airtable: result });
		}

		// const allData = await a.table('Table 1').select().all();

		return results;
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
