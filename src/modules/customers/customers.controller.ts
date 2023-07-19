import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
	InternalServerErrorException,
	NotFoundException,
	BadRequestException,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../roles/roles.decorator';
import { UserRoles } from '../roles/roles.enum';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Customers')
@UseGuards(AuthGuard)
@Roles(UserRoles.ADMIN)
@Controller('customers')
export class CustomersController {
	constructor(private readonly customersService: CustomersService) {}

	@Post()
	async create(@Body() createCustomerDto: CreateCustomerDto) {
		const exist = await this.customersService.findOneByEmail(
			createCustomerDto.email,
		);

		if (exist) {
			throw new BadRequestException('E-mail already in use');
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
			throw new NotFoundException('Customer not found');
		}

		return {
			...customer,
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
			throw new NotFoundException('Customer not found');
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
			throw new NotFoundException('Customer not found');
		}

		await this.customersService.remove(id);

		return {
			statusCode: 204,
		};
	}
}