import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	BadRequestException,
	NotFoundException,
	HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { UserRoles } from '../roles/roles.enum';
import { UseAuthGuard } from '../auth/auth.guard';
import { hashPasssword } from 'src/utils/password';
import { Roles } from '../roles/roles.decorator';

@ApiTags('Users')
@UseAuthGuard()
@Roles(UserRoles.ADMIN)
@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post()
	async create(@Body() createUserDto: CreateUserDto) {
		const exist = await this.usersService.findOneByEmail(createUserDto.email);

		if (exist) {
			throw new BadRequestException('E-mail já está em uso');
		}

		const newUser = await this.usersService.create({
			...createUserDto,
			password: await hashPasssword(createUserDto.password),
			image: 'https://thefixt.com/user-default.jpeg',
		});

		return newUser;
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
		const user = await this.usersService.findOne(id);

		if (!user) {
			throw new NotFoundException('Este usuário não existe');
		}

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
			throw new NotFoundException('Este usuário não existe');
		}

		const user = await this.usersService.update(id, updateUserDto);

		return {
			id: user.id,
			name: user.name,
			email: user.email,
			image: user.image,
			role: user.role,
		};
	}

	@Delete(':id')
	async remove(@Param('id') id: number) {
		const exist = await this.usersService.findOne(id);

		if (!exist) {
			throw new NotFoundException('Este usuário não existe');
		}

		await this.usersService.remove(id);

		return {
			statusCode: HttpStatus.NO_CONTENT,
		};
	}
}
