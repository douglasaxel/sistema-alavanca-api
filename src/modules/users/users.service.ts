import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class UsersService {
	constructor(private prismaService: PrismaService) {}

	async create(createUserDto: CreateUserDto) {
		const exist = await this.findOneByEmail(createUserDto.email);

		if (exist) {
			throw new BadRequestException(['E-mail already in use']);
		}

		await this.prismaService.user.create({
			data: {
				name: createUserDto.name,
				email: createUserDto.email,
				password: createUserDto.password,
				image: createUserDto.image,
				role: createUserDto.role,
			},
		});
	}

	async findAll() {
		const users = await this.prismaService.user.findMany({
			where: { deletedAt: null },
		});

		return users;
	}

	async findOne(id: number) {
		const user = await this.prismaService.user.findUnique({
			where: { id, deletedAt: null },
		});

		return user;
	}

	async findOneByEmail(email: string) {
		const user = await this.prismaService.user.findFirst({
			where: { email, deletedAt: null },
		});

		return user;
	}

	async update(id: number, updateUserDto: UpdateUserDto) {
		const updatedUser = await this.prismaService.user.update({
			where: { id, deletedAt: null },
			data: {
				name: updateUserDto.name,
				email: updateUserDto.email,
				password: updateUserDto.password,
				image: updateUserDto.image,
				role: updateUserDto.role,
			},
		});

		return updatedUser;
	}

	async remove(id: number) {
		await this.prismaService.user.update({
			where: { id },
			data: { deletedAt: new Date() },
		});
	}
}
