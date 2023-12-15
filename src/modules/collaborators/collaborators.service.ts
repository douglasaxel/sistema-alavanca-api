import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { AddCollaboratorDto } from './dto/add-collaborator.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class CollaboratorsService {
	constructor(private prismaService: PrismaService) {}

	findAllCollaborators() {
		return this.prismaService.collaborator.findMany({
			orderBy: { name: 'asc' },
			select: {
				id: true,
				name: true,
				email: true,
			},
		});
	}

	async addCollaborators(idProject: number, collaborator: AddCollaboratorDto) {
		const exist = await this.prismaService.collaborator.findFirst({
			where: {
				OR: [{ id: collaborator.id }, { email: collaborator.email }],
			},
			select: {
				id: true,
				projects: {
					select: {
						idProject: true,
					},
				},
			},
		});

		if (exist) {
			if (exist.projects.map(p => p.idProject).includes(idProject)) {
				throw new BadRequestException([
					'Este colaborador já está alocado a este projeto',
				]);
			}
			const updatedCollaborator = await this.prismaService.collaborator.update({
				where: { id: exist.id },
				data: {
					name: collaborator.name,
					email: collaborator.email,
					projects: {
						create: {
							idProject,
						},
					},
				},
			});
			return updatedCollaborator;
		}

		const createdCollaborator = await this.prismaService.collaborator.create({
			data: {
				name: collaborator.name,
				email: collaborator.email,
				projects: {
					create: {
						idProject,
					},
				},
			},
		});
		return createdCollaborator;
	}

	removeCollaborators(idCollaborator: number) {
		return this.prismaService.collaborator.delete({
			where: { id: idCollaborator },
		});
	}

	async removeCollaboratorFromProject(
		idProject: number,
		idCollaborator: number,
	) {
		const exist = await this.prismaService.collaboratorsOnProjects.findFirst({
			where: {
				idProject,
				idCollaborator,
			},
		});

		if (!exist) {
			throw new NotFoundException([
				'Este colaborador não está alocado neste projeto',
			]);
		}

		return this.prismaService.collaboratorsOnProjects.delete({
			where: {
				idProject_idCollaborator: {
					idProject,
					idCollaborator,
				},
			},
		});
	}
}
