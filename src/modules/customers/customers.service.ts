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
		contacts,
	}: CreateCustomerDto) {
		const customer = await this.prismaService.customer.create({
			data: {
				image,
				name,
				cnpj,
				accountable,
				email,
				phone,
				contacts: {
					createMany: {
						data: contacts.map(c => ({
							name: c.name,
							email: c.email,
							phone: c.phone,
						})),
					},
				},
			},
		});

		return customer;
	}

	async findAll() {
		const customers = await this.prismaService.customer.findMany({
			where: { deletedAt: null },
			include: {
				_count: true,
				contacts: true,
			},
			orderBy: {
				name: 'asc',
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
				contacts: true,
				projects: {
					include: {
						airtableLinks: true,
					},
					orderBy: { name:'asc' },
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
		{
			image,
			name,
			cnpj,
			accountable,
			email,
			phone,
			contacts,
		}: UpdateCustomerDto,
	) {
		const customer = this.prismaService.customer.update({
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

		const clearContacts = this.prismaService.contact.deleteMany({
			where: { idCustomer: id },
		});

		const addContacts = this.prismaService.contact.createMany({
			data: contacts.map(c => ({
				...c,
				idCustomer: id,
			})),
		});

		const [customerRes] = await this.prismaService.$transaction([
			customer,
			clearContacts,
			addContacts,
		]);

		return customerRes;
	}

	async remove(id: number) {
		await this.prismaService.customer.update({
			where: { id },
			data: { deletedAt: new Date() },
		});
	}
}
