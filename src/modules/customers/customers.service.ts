import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class CustomersService {
	constructor(private prismaService: PrismaService) {}

	async create({
		image,
		name,
		cnpj,
		accountable,
		email,
		phone,
	}: CreateCustomerDto) {
		const customer = await this.prismaService.customer.create({
			data: {
				image,
				name,
				cnpj,
				accountable,
				email,
				phone,
			},
		});

		return customer;
	}

	async findAll() {
		const customers = await this.prismaService.customer.findMany({
			where: { deletedAt: null },
		});

		return customers;
	}

	async findOne(id: number) {
		const customer = await this.prismaService.customer.findUnique({
			where: { id, deletedAt: null },
		});

		return customer;
	}

	async findOneByEmail(email: string) {
		const customer = await this.prismaService.customer.findUnique({
			where: { email, deletedAt: null },
		});

		return customer;
	}

	async update(
		id: number,
		{ image, name, cnpj, accountable, email, phone }: UpdateCustomerDto,
	) {
		const customer = await this.prismaService.customer.update({
			where: { id, deletedAt: null },
			data: {
				image,
				name,
				cnpj,
				accountable,
				email,
				phone,
			},
		});

		return customer;
	}

	async remove(id: number) {
		await this.prismaService.customer.update({
			where: { id },
			data: { deletedAt: new Date() },
		});
	}
}
