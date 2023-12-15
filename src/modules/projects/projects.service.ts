/* eslint-disable indent */
import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from 'src/database/prisma.service';
import { FindAllProjectDto } from './dto/find-all-projects.dto';

@Injectable()
export class ProjectsService {
	constructor(private prismaService: PrismaService) {}

	create(
		{ airtableLinks, ...createData }: CreateProjectDto,
		driveFolderId: string,
	) {
		return this.prismaService.project.create({
			data: {
				...createData,
				driveFolderId,
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

	async update(id: number, { airtableLinks, ...updateData }: UpdateProjectDto) {
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

	remove(id: number) {
		return this.prismaService.project.update({
			where: { id, deletedAt: null },
			data: { deletedAt: new Date() },
		});
	}
}
