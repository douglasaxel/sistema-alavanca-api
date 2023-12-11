import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
	IsArray,
	IsDate,
	IsNotEmpty,
	IsNumber,
	IsString,
	IsUrl,
	Min,
	ValidateNested,
	IsOptional,
	ArrayMinSize,
} from 'class-validator';
import { CreateCollaboratorDto } from './create-collaborator.dto';

class CreateAirtableLink {
	@IsUrl()
	@IsNotEmpty({ message: 'A URL do airtable não pode ser vazia' })
	@ApiProperty()
	public url: string;

	@IsUrl()
	@IsNotEmpty({ message: 'O iframe do airtable não pode ser vazio' })
	@ApiProperty()
	public iframe: string;
}

export class CreateProjectDto {
	@IsNumber()
	@IsNotEmpty({ message: 'O código não pode ser vazio' })
	@Min(0, { message: 'O código deve ser maior que 0' })
	@ApiProperty()
	public code: number;

	@IsString()
	@IsNotEmpty({ message: 'O nome não pode ser vazio' })
	@ApiProperty()
	public name: string;

	@IsNumber()
	@IsNotEmpty({ message: 'O ID do cliente não pode ser vazio' })
	@ApiProperty()
	public idCustomer: number;

	// @IsString()
	// @IsNotEmpty({
	// 	message: 'O CNPJ não pode ser vazio',
	// })
	// @ApiProperty()
	// public cnpj: string;

	@IsString()
	@IsNotEmpty({ message: 'A descrição não pode ser vazia' })
	@ApiProperty()
	public description: string;

	@IsString()
	@IsNotEmpty({ message: 'O responsável não pode ser vazio' })
	@ApiProperty()
	public accountable: string;

	@IsNumber()
	@IsNotEmpty({ message: 'O valor não pode ser vazio' })
	@ApiProperty()
	public value: number;

	@IsString()
	@IsUrl()
	@IsOptional()
	// @IsNotEmpty({ message: 'A URL do AirTable não pode ser vazio' })
	@ApiProperty({ deprecated: true })
	public airtableUrl: string;

	@IsArray()
	@ValidateNested({ each: true })
	@ArrayMinSize(1, { message: 'Adicione pelo menos um link do Airtable' })
	@Type(() => CreateAirtableLink)
	public airtableLinks: CreateAirtableLink[];

	@IsString()
	@IsUrl()
	@IsOptional()
	// @IsNotEmpty({ message: 'A URL do iframe do AirTable não pode ser vazio' })
	@ApiProperty({ deprecated: true })
	public airtableIframeUrl: string;

	@IsDate()
	@IsNotEmpty({ message: 'A data de inicio não pode ser vazio' })
	@ApiProperty()
	@Transform(({ value }) => new Date(value))
	public startDate: Date;

	@IsDate()
	@IsNotEmpty({ message: 'A data de entrega não pode ser vazia' })
	@ApiProperty()
	@Transform(({ value }) => new Date(value))
	public endDate: Date;

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateCollaboratorDto)
	@ApiProperty()
	public collaborators: CreateCollaboratorDto[];
}
