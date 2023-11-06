import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	InternalServerErrorException,
	NotFoundException,
	BadRequestException,
	HttpStatus,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { UseAuthGuard } from '../auth/auth.guard';
import { Roles } from '../roles/roles.decorator';
import { UserRoles } from '../roles/roles.enum';
import { ApiTags } from '@nestjs/swagger';
import { getProjectTasks } from 'src/services/airtable';
import { getBase64MimeTypeAndValue } from 'src/utils/string-helper';
import { createDriveFile } from 'src/services/googleapi';

@ApiTags('Customers')
@UseAuthGuard()
@Roles(UserRoles.ADMIN, UserRoles.MASTER)
@Controller('customers')
export class CustomersController {
	constructor(private readonly customersService: CustomersService) {}

	@Post()
	async create(@Body() createCustomerDto: CreateCustomerDto) {
		const exist = await this.customersService.findOneByUniqueKeys({
			cnpj: createCustomerDto.cnpj,
			email: createCustomerDto.email,
			phone: createCustomerDto.phone,
		});
		if (createCustomerDto.email.includes(exist?.email)) {
			throw new BadRequestException(['E-mail já está em uso']);
		}

		if (createCustomerDto.cnpj.includes(exist?.cnpj)) {
			throw new BadRequestException(['CNPJ já cadastrado']);
		}

		if (createCustomerDto.phone.includes(exist?.phone)) {
			throw new BadRequestException(['Telefone já cadastrado']);
		}

		const { base64, mimeType } = getBase64MimeTypeAndValue(
			createCustomerDto.image,
		);
		const thumbnailLink = await createDriveFile({
			fileBase64: base64,
			name: createCustomerDto.name,
			type: 'customer',
			mimeType,
		});

		const customer = await this.customersService.create({
			...createCustomerDto,
			image: thumbnailLink,
		});

		if (!customer) {
			throw new InternalServerErrorException();
		}

		return {
			...customer,
			updatedAt: undefined,
			deletedAt: undefined,
		};
	}

	@Get()
	async findAll() {
		const customers = await this.customersService.findAll();

		return customers.map(customer => ({
			...customer,
			updatedAt: undefined,
			deletedAt: undefined,
		}));
	}

	@Get(':id')
	async findOne(@Param('id') id: number) {
		const customer = await this.customersService.findOne(id);
		if (!customer) {
			throw new NotFoundException(['Este cliente não existe']);
		}

		const results = [];
		for (const proj of customer.projects) {
			const totalTasks = {
				todo: 0,
				doing: 0,
				done: 0,
				total: 0,
			};
			for (const link of proj.airtableLinks) {
				const tasks = await getProjectTasks(link.url);
				totalTasks.todo = totalTasks.todo + tasks.todo;
				totalTasks.doing = totalTasks.doing + tasks.doing;
				totalTasks.done = totalTasks.done + tasks.done;
				totalTasks.total = totalTasks.total + tasks.total;
			}
			results.push({ ...proj, tasks: totalTasks });
		}

		return {
			...customer,
			projects: results.map(p => ({ ...p, airtableLinks: undefined })),
			updatedAt: undefined,
			deletedAt: undefined,
		};
	}

	@Patch(':id')
	async update(
		@Param('id') id: number,
		@Body() updateCustomerDto: UpdateCustomerDto,
	) {
		const customer = await this.customersService.findOne(id);
		if (!customer) {
			throw new NotFoundException(['Este cliente não existe']);
		}

		const updatedCustomer = await this.customersService.update(
			id,
			updateCustomerDto,
		);

		return {
			...updatedCustomer,
			updatedAt: undefined,
			deletedAt: undefined,
		};
	}

	@Delete(':id')
	async remove(@Param('id') id: number) {
		const customer = await this.customersService.findOne(id);
		if (!customer) {
			throw new NotFoundException(['Este cliente não existe']);
		}

		await this.customersService.remove(id);

		return {
			statusCode: HttpStatus.NO_CONTENT,
		};
	}
}
