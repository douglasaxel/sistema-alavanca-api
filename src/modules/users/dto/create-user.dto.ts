import { ApiProperty, OmitType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserRoles } from '../../roles/roles.enum';

export class CreateUserDto extends OmitType(User, ['id']) {
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	public name: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	public email: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	public password: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	public image: string;

	@IsString()
	@IsNotEmpty()
	@IsEnum(UserRoles, { always: true })
	@ApiProperty()
	public role: UserRoles;
}
