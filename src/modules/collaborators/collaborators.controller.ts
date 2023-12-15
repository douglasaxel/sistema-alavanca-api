import { Controller, Get, Body, Param, Delete, Put } from '@nestjs/common';
import { CollaboratorsService } from './collaborators.service';
import { ApiNoContentResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import { UserRoles } from '../roles/roles.enum';
import { AddCollaboratorDto } from './dto/add-collaborator.dto';

@ApiTags('Collaborators')
@Controller('collaborators')
export class CollaboratorsController {
	constructor(private readonly collaboratorsService: CollaboratorsService) {}

	@Roles(UserRoles.ADMIN, UserRoles.MASTER, UserRoles.BASIC, UserRoles.CUSTOMER)
	@Get()
	async getCollaborators() {
		return this.collaboratorsService.findAllCollaborators();
	}

	@Roles(UserRoles.ADMIN, UserRoles.MASTER)
	@Put(':idProject')
	async addCollaborators(
		@Param('idProject') idProject: number,
		@Body() addCollaboratorDto: AddCollaboratorDto,
	) {
		return this.collaboratorsService.addCollaborators(
			idProject,
			addCollaboratorDto,
		);
	}

	@Roles(UserRoles.ADMIN, UserRoles.MASTER)
	@ApiNoContentResponse()
	@Delete(':idCollaborator/:idProject')
	async removeCollaboratorFromProject(
		@Param('idProject') idProject: number,
		@Param('idCollaborator') idCollaborator: number,
	) {
		await this.collaboratorsService.removeCollaboratorFromProject(
			idProject,
			idCollaborator,
		);
		return null;
	}

	@Roles(UserRoles.ADMIN, UserRoles.MASTER)
	@ApiNoContentResponse()
	@Delete(':idCollaborator/delete')
	async removeCollaborators(@Param('idCollaborator') idCollaborator: number) {
		await this.collaboratorsService.removeCollaborators(idCollaborator);
		return null;
	}
}
