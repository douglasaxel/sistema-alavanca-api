import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	public email: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	public password: string;
}
