/* eslint-disable indent */
import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from 'src/database/prisma.service';
import { FindAllProjectDto } from './dto/find-all-projects.dto';

@Injectable()
export class ProjectsService {
	constructor(private prismaService: PrismaService) {}

	create({ collaborators, ...createData }: CreateProjectDto, driveFolderId: string) {
		return this.prismaService.project.create({
			data: {
				...createData,
				driveFolderId,
				collaborators: !collaborators
					? undefined
					: {
							connectOrCreate: collaborators.map(c => ({
								where: { email: c.email },
								create: c,
							})),
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
			},
		});
	}

	update(id: number, { collaborators, ...updateData }: UpdateProjectDto) {
		return this.prismaService.project.update({
			where: { id, deletedAt: null },
			data: {
				...updateData,
				collaborators: !collaborators
					? undefined
					: {
							connectOrCreate: collaborators.map(c => ({
								where: { email: c.email },
								create: c,
							})),
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
