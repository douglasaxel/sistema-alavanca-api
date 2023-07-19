import { ApiProperty } from '@nestjs/swagger';
import {
	IsBase64,
	IsEmail,
	IsNotEmpty,
	IsPhoneNumber,
	IsString,
} from 'class-validator';

export class CreateCustomerDto {
	// @IsBase64()
	// @IsNotEmpty()
	@ApiProperty()
	public image: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	public name: string;

	@IsString()
	@IsNotEmpty()
	@IsPhoneNumber('BR')
	@ApiProperty()
	public phone: string;

	@IsString()
	@IsNotEmpty()
	@IsEmail()
	@ApiProperty()
	public email: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	public cnpj: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	public accountable: string;
}
