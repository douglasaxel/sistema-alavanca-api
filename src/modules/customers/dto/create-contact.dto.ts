import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
import { getNumbersFromString } from 'src/utils/string-helper';

export class CreateContactDto {
	@IsString()
	@IsNotEmpty({ message: 'O nome do contato não pode ser vazio' })
	public name: string;

	@IsString()
	@IsEmail()
	@IsNotEmpty({ message: 'O e-mail do contato não pode ser vazio' })
	@Transform(({ value }) => value.replace(/\s/g, '').toLocaleLowerCase())
	public email: string;

	@IsString()
	@IsNotEmpty({
		message: 'O telefone não pode ser vazio',
	})
	@IsPhoneNumber('BR')
	@Transform(({ value }) => getNumbersFromString(value))
	@ApiProperty()
	public phone: string;
}
