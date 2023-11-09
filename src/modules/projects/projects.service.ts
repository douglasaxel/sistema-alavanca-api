/* eslint-disable indent */
import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from 'src/database/prisma.service';
import { FindAllProjectDto } from './dto/find-all-projects.dto';
import { CreateCollaboratorDto } from './dto/create-collaborator.dto';

@Injectable()
export class ProjectsService {
	constructor(private prismaService: PrismaService) {}

	create(
		{ collaborators, airtableLinks, ...createData }: CreateProjectDto,
		driveFolderId: string,
	) {
		return this.prismaService.project.create({
			data: {
				...createData,
				driveFolderId,
				collaborators: !collaborators
					? undefined
					: {
							create: collaborators,
					  },
				airtableLinks: !airtableLinks
					? undefined
					: {
							create: airtableLinks,
					  },
			},
		});
	}

	findAll({
		name,
		startDate,
		endDate,
		customerId,
		collaborators,
	}: FindAllProjectDto) {
		return this.prismaService.project.findMany({
			where: {
				name: !name ? undefined : { contains: name },
				startDate: !startDate ? undefined : { gte: startDate },
				endDate: !endDate ? undefined : { lte: endDate },
				customer: !customerId ? undefined : { id: customerId },
				deletedAt: null,
			},
			include: {
				customer: true,
				airtableLinks: true,
				collaborators,
			},
		});
	}

	findOne(id: number) {
		return this.prismaService.project.findFirst({
			where: {
				id,
				deletedAt: null,
			},
			include: {
				customer: {
					select: {
						id: true,
						name: true,
					},
				},
				collaborators: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
				airtableLinks: {
					select: {
						id: true,
						url: true,
					},
				},
			},
		});
	}

	update(id: number, updateData: UpdateProjectDto) {
		return this.prismaService.project.update({
			where: { id, deletedAt: null },
			data: {
				...updateData,
				collaborators: undefined,
				airtableLinks: undefined,
			},
		});
	}

	async createCollaborators(id: number, collaborator: CreateCollaboratorDto) {
		return this.prismaService.collaborator.create({
			data: {
				...collaborator,
				idProject: id,
			},
		});
	}

	async removeCollaborators(idProject: number, idCollaborator: number) {
		return this.prismaService.collaborator.delete({
			where: { id: idCollaborator, idProject },
		});
	}

	remove(id: number) {
		return this.prismaService.project.update({
			where: { id, deletedAt: null },
			data: { deletedAt: new Date() },
		});
	}
}
