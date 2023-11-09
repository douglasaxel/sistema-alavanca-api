import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
	IsEmail,
	IsNotEmpty,
	IsPhoneNumber,
	IsString,
	Validate,
	IsArray,
	ValidateNested,
	ArrayMinSize,
	IsOptional,
} from 'class-validator';
import { ValidateCNPJ } from 'src/class-validator/ValidateCNPJ';
import { getNumbersFromString } from 'src/utils/string-helper';
import { CreateContactDto } from './create-contact.dto';

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
	@IsPhoneNumber('BR')
	@IsOptional()
	@Transform(({ value }) => getNumbersFromString(value))
	@ApiProperty({ deprecated: true })
	public phone: string;

	@IsString()
	@IsEmail()
	@IsOptional()
	@ApiProperty({ deprecated: true })
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

	@IsArray({ message: '`contacts` deve ser um vetor' })
	@ValidateNested({ each: true })
	@ArrayMinSize(1, { message: 'O cliente deve ter no mínimo 1 contato' })
	@Type(() => CreateContactDto)
	@ApiProperty()
	public contacts: CreateContactDto[];
}
