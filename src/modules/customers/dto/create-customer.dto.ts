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
	IsObject,
	IsNumber,
	Min,
} from 'class-validator';
import { ValidateCNPJ } from 'src/class-validator/ValidateCNPJ';
import { getNumbersFromString } from 'src/utils/string-helper';
import { CreateContactDto } from './create-contact.dto';

class CreateUserAddressDto {
	@IsString()
	@IsNotEmpty({
		message: 'O CEP é obrigatório',
	})
	@ApiProperty()
	public zipCode: string;

	@IsString()
	@IsNotEmpty({
		message: 'A rua é obrigatória',
	})
	@ApiProperty()
	public street: string;

	@IsNumber()
	@IsNotEmpty({
		message: 'O número é obrigatório',
	})
	@Min(1, { message: 'O número não pode ser menor que 1' })
	@Transform(({ value }) => +value)
	@ApiProperty()
	public number: number;

	@IsString()
	@IsOptional()
	@ApiProperty()
	public complement: string;

	@IsString()
	@IsNotEmpty({
		message: 'O bairro é obrigatório',
	})
	@ApiProperty()
	public neighborhood: string;

	@IsString()
	@IsNotEmpty({
		message: 'A cidade é obrigatória',
	})
	@ApiProperty()
	public city: string;

	@IsString()
	@IsNotEmpty({
		message: 'O estado é obrigatório',
	})
	@ApiProperty()
	public state: string;

	@IsString()
	@IsNotEmpty({
		message: 'O país é obrigatório',
	})
	@ApiProperty()
	public country: string;
}

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
		message: 'O nome fantasia não pode ser vazio',
	})
	@ApiProperty()
	public companyName: string;

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

	@IsArray()
	@IsNotEmpty({ message: 'O endereço é obrigatório' })
	@ValidateNested({ each: true })
	@ArrayMinSize(1, { message: 'O cliente deve ter no mínimo 1 endereço' })
	@Type(() => CreateUserAddressDto)
	public addresses: CreateUserAddressDto[];
}
