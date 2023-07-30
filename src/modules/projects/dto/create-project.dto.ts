import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
	IsArray,
	IsDate,
	IsEmail,
	IsNotEmpty,
	IsNumber,
	IsString,
	IsUrl,
	ValidateNested,
} from 'class-validator';

class ColaboratorDto {
	@IsString()
	@IsNotEmpty({ message: 'O nome do colaborador não pode ser vazio' })
	public name: string;

	@IsString()
	@IsEmail()
	@IsNotEmpty({ message: 'O e-mail do colaborador não pode ser vazio' })
	public email: string;
}

export class CreateProjectDto {
	@IsString()
	@IsNotEmpty({
		message: 'O nome não pode ser vazio',
	})
	@ApiProperty()
	public name: string;

	@IsString()
	@IsNotEmpty({
		message: 'A Razão Social não pode ser vazia',
	})
	@ApiProperty()
	public corporateName: string;

	@IsString()
	@IsNotEmpty({
		message: 'O CNPJ não pode ser vazio',
	})
	@ApiProperty()
	public cnpj: string;

	@IsString()
	@IsNotEmpty({
		message: 'A descrição não pode ser vazia',
	})
	@ApiProperty()
	public description: string;

	@IsString()
	@IsNotEmpty({
		message: 'O responsável não pode ser vazio',
	})
	@ApiProperty()
	public accountable: string;

	@IsNumber()
	@IsNotEmpty({
		message: 'O valor não pode ser vazio',
	})
	@ApiProperty()
	public value: string;

	@IsString()
	@IsUrl()
	@IsNotEmpty({
		message: 'A URL do AirTable não pode ser vazio',
	})
	@ApiProperty()
	public airtableUrl: string;

	@IsDate()
	@IsNotEmpty({
		message: 'A data de inicio não pode ser vazio',
	})
	@ApiProperty()
	public startDate: string;

	@IsDate()
	@IsNotEmpty({
		message: 'A data de entrega não pode ser vazia',
	})
	@ApiProperty()
	public endDate: string;

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => ColaboratorDto)
	public colaborators: ColaboratorDto[];
}
