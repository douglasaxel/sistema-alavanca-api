import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
	IsEmail,
	IsNotEmpty,
	IsPhoneNumber,
	IsString,
	Validate,
} from 'class-validator';
import { ValidateCNPJ } from 'src/class-validator/ValidateCNPJ';
import { getNumbersFromString } from 'src/utils/string-helper';

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
	@Transform(({ value }) => getNumbersFromString(value))
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
	@Validate(ValidateCNPJ)
	@Transform(({ value }) => getNumbersFromString(value))
	@ApiProperty()
	public cnpj: string;

	@IsString()
	@IsNotEmpty({
		message: 'O responsável não pode ser vazio',
	})
	@ApiProperty()
	public accountable: string;
}
