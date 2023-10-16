import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
	IsBoolean,
	IsBooleanString,
	IsDate,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
} from 'class-validator';

export class FindAllProjectDto {
	@IsString()
	@IsOptional()
	@ApiProperty()
	public name?: string;

	@IsNumber()
	@IsOptional()
	@ApiProperty()
	@Transform(({ value }) => +value)
	public customerId?: number;

	@IsBoolean()
	@IsOptional()
	@ApiProperty()
	@Transform(({ value }) => value === 'true')
	public collaborators?: boolean;

	@IsDate()
	@IsOptional()
	@ApiProperty()
	@Transform(({ value }) => new Date(value))
	public startDate?: Date;

	@IsDate()
	@IsOptional()
	@ApiProperty()
	@Transform(({ value }) => new Date(value))
	public endDate?: Date;
}
