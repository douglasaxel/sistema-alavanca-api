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
import { getProjectTasks } from 'src/utils/airtable-helpers';

@ApiTags('Customers')
@UseAuthGuard()
@Roles(UserRoles.ADMIN)
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
			throw new BadRequestException('E-mail já está em uso');
		}

		if (createCustomerDto.cnpj.includes(exist?.cnpj)) {
			throw new BadRequestException('CNPJ já cadastrado');
		}

		if (createCustomerDto.phone.includes(exist?.phone)) {
			throw new BadRequestException('Telefone já cadastrado');
		}

		const customer = await this.customersService.create({
			...createCustomerDto,
			image: 'https://thefixt.com/user-default.jpeg',
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
			throw new NotFoundException('Este cliente não existe');
		}

		const results = [];
		for (const proj of customer.projects) {
			const tasks = await getProjectTasks(proj.airtableUrl);
			results.push({ ...proj, tasks });
		}

		return {
			...customer,
			projects: results,
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
			throw new NotFoundException('Este cliente não existe');
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
			throw new NotFoundException('Este cliente não existe');
		}

		await this.customersService.remove(id);

		return {
			statusCode: HttpStatus.NO_CONTENT,
		};
	}
}
