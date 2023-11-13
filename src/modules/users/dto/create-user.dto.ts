import { ApiProperty, OmitType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserRoles } from '../../roles/roles.enum';

export class CreateUserDto extends OmitType(User, ['id']) {
	@IsString()
	@IsNotEmpty({
		message: 'O nome não pode ser vazio',
	})
	@ApiProperty()
	public name: string;

	@IsString()
	@IsNotEmpty({
		message: 'O e-mail não pode ser vazio',
	})
	@ApiProperty()
	public email: string;

	@IsString()
	@IsNotEmpty({
		message: 'A senha não pode ser vazia',
	})
	@ApiProperty()
	public password: string;

	// @IsBase64({ message: 'A imagem deve ser enviada em base64' })
	@IsString()
	@IsNotEmpty({
		message: 'A imagem não pode ser vazia',
	})
	@ApiProperty()
	public image: string;

	@IsString()
	@IsNotEmpty({
		message: 'O tipo de acesso não pode ser vazio',
	})
	@IsEnum(UserRoles, { always: true })
	@ApiProperty()
	public role: UserRoles;
}
