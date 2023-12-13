/* eslint-disable indent */
import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from 'src/database/prisma.service';
import { FindAllProjectDto } from './dto/find-all-projects.dto';
import { AddCollaboratorDto } from './dto/add-collaborator.dto';
import { PrismaPromise } from '@prisma/client';

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
				// collaborators: !collaborators
				// 	? undefined
				// 	: {
				// 			create: collaborators,
				// 	  },
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
			orderBy: [{ code: 'asc' }, { name: 'asc' }],
		});
	}

	async findOne(idProject: number) {
		const projectTransaction = this.prismaService.project.findFirst({
			where: {
				id: idProject,
				deletedAt: null,
			},
			include: {
				customer: {
					select: {
						id: true,
						name: true,
					},
				},
				airtableLinks: {
					select: {
						id: true,
						url: true,
						iframe: true,
					},
				},
			},
		});
		const collaboratorsTransaction = this.prismaService.collaborator.findMany({
			where: { projects: { some: { idProject } } },
		});
		const [project, collaborators] = await this.prismaService.$transaction([
			projectTransaction,
			collaboratorsTransaction,
		]);

		return {
			...project,
			collaborators,
		};
	}

	async update(
		id: number,
		{ collaborators, airtableLinks, ...updateData }: UpdateProjectDto,
	) {
		const transactions = [];
		transactions.push(
			this.prismaService.project.update({
				where: { id, deletedAt: null },
				data: {
					...updateData,
					collaborators: undefined,
					airtableLinks: undefined,
				},
			}),
		);

		// if (collaborators.length > 0) {
		// 	transactions.push(
		// 		this.prismaService.collaborator.deleteMany({
		// 			where: { idProject: id },
		// 		}),
		// 	);
		// 	transactions.push(
		// 		this.prismaService.collaborator.createMany({
		// 			data: collaborators.map(c => ({
		// 				...c,
		// 				idProject: id,
		// 			})),
		// 		}),
		// 	);
		// }

		if (airtableLinks.length > 0) {
			transactions.push(
				this.prismaService.airtableLink.deleteMany({
					where: { idProject: id },
				}),
			);
			transactions.push(
				this.prismaService.airtableLink.createMany({
					data: airtableLinks.map(a => ({
						idProject: id,
						url: a.url,
						iframe: a.iframe,
					})),
				}),
			);
		}

		await this.prismaService.$transaction(transactions);
	}

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
			await this.prismaService.collaborator.update({
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
			return null;
		}

		await this.prismaService.collaborator.create({
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
		return null;
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

	remove(id: number) {
		return this.prismaService.project.update({
			where: { id, deletedAt: null },
			data: { deletedAt: new Date() },
		});
	}
}
