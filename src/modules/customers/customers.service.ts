import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PrismaService } from 'src/database/prisma.service';

type IFindOneByUniqueKeysParams = {
	cnpj?: string;
	email?: string;
	phone?: string;
};

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
			include: {
				_count: true,
			},
		});

		return customers.map(customer => ({
			...customer,
			_count: undefined,
			totalProjects: customer._count.projects,
		}));
	}

	async findOne(id: number) {
		const customer = await this.prismaService.customer.findUnique({
			where: { id, deletedAt: null },
			include: {
				projects: {
					include: {
						airtableLinks: true,
					},
				},
			},
		});

		return customer;
	}

	async findOneByUniqueKeys({
		cnpj,
		email,
		phone,
	}: IFindOneByUniqueKeysParams) {
		const customer = await this.prismaService.customer.findFirst({
			where: {
				deletedAt: null,
				OR: [{ cnpj }, { email }, { phone }],
			},
		});

		if (!customer) return null;

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
