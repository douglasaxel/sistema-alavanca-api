import { Transform } from 'class-transformer';
import {
	IsEmail,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddCollaboratorDto {
	@IsNumber()
	@IsOptional()
	@Transform(({ value }) => +value)
	@ApiProperty()
	public id?: number;

	@ValidateIf(o => o.id === undefined)
	@IsString()
	@IsNotEmpty({ message: 'O nome do colaborador não pode ser vazio' })
	@ApiProperty()
	public name?: string;

	@ValidateIf(o => o.id === undefined)
	@IsString()
	@IsEmail()
	@IsNotEmpty({ message: 'O e-mail do colaborador não pode ser vazio' })
	@Transform(({ value }) => value.replace(/\s/g, '').toLocaleLowerCase())
	@ApiProperty()
	public email?: string;
}
