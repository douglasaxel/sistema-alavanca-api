import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from 'src/database/prisma.service';
import { FindAllProjectDto } from './dto/find-all-projects.dto';

@Injectable()
export class ProjectsService {
	constructor(private prismaService: PrismaService) {}

	create(createProjectDto: CreateProjectDto) {
		return this.prismaService.project.create({
			data: createProjectDto,
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
		return this.prismaService.project.findMany({
			where: {
				id,
				deletedAt: null,
			},
		});
	}

	update(id: number, updateProjectDto: UpdateProjectDto) {
		return this.prismaService.project.update({
			where: { id, deletedAt: null },
			data: updateProjectDto,
		});
	}

	remove(id: number) {
		return this.prismaService.project.update({
			where: { id, deletedAt: null },
			data: { deletedAt: new Date() },
		});
	}
}
