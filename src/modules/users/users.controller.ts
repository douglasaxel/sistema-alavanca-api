import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
	BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { UserRoles } from '../roles/roles.enum';
import { AuthGuard } from '../auth/auth.guard';
import { hashPasssword } from 'src/utils/password';
import { Roles } from '../roles/roles.decorator';

@ApiTags('Users')
@UseGuards(AuthGuard)
@Roles(UserRoles.ADMIN)
@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post()
	async create(@Body() createUserDto: CreateUserDto) {
		return this.usersService.create({
			...createUserDto,
			password: await hashPasssword(createUserDto.password),
		});
	}

	@Get()
	async findAll() {
		const users = await this.usersService.findAll();

		return users.map(user => ({
			id: user.id,
			name: user.name,
			email: user.email,
			image: user.image,
			role: user.role,
		}));
	}

	@Get(':id')
	async findOne(@Param('id') id: number) {
		console.log(typeof id, id);
		const user = await this.usersService.findOne(id);

		return {
			id: user.id,
			name: user.name,
			email: user.email,
			image: user.image,
			role: user.role,
		};
	}

	@Patch(':id')
	async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
		const exist = await this.usersService.findOne(id);

		if (!exist) {
			throw new BadRequestException('User not found');
		}

		await this.usersService.update(id, updateUserDto);

		const user = await this.usersService.findOne(id);

		return {
			id: user.id,
			name: user.name,
			email: user.email,
			image: user.image,
			role: user.role,
		};
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.usersService.remove(+id);
	}
}
