import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateCollaboratorDto {
	@IsString()
	@IsNotEmpty({ message: 'O nome do colaborador não pode ser vazio' })
	public name: string;

	@IsString()
	@IsEmail()
	@IsNotEmpty({ message: 'O e-mail do colaborador não pode ser vazio' })
	@Transform(({ value }) => value.replace(/\s/g, '').toLocaleLowerCase())
	public email: string;
}
