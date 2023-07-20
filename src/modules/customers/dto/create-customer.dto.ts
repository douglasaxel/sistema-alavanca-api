import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class CreateCustomerDto {
	@IsString()
	@IsNotEmpty({
		message: 'A imagem não pode ser vazia',
	})
	@ApiProperty()
	public image: string;

	@IsString()
	@IsNotEmpty({
		message: 'O nome não pode ser vazio',
	})
	@ApiProperty()
	public name: string;

	@IsString()
	@IsNotEmpty({
		message: 'O telefone não pode ser vazio',
	})
	@IsPhoneNumber('BR')
	@ApiProperty()
	public phone: string;

	@IsString()
	@IsNotEmpty({
		message: 'O e-mail não pode ser vazio',
	})
	@IsEmail()
	@ApiProperty()
	public email: string;

	@IsString()
	@IsNotEmpty({
		message: 'O CNPJ não pode ser vazio',
	})
	@ApiProperty()
	public cnpj: string;

	@IsString()
	@IsNotEmpty({
		message: 'O responsável não pode ser vazio',
	})
	@ApiProperty()
	public accountable: string;
}
