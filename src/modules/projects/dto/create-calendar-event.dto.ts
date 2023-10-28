import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, MinDate } from 'class-validator';

export class CreateCalendarEventDto {
	@IsDate()
	@MinDate(new Date(), { message: 'A data de inicio não pode ser no passado' })
	@IsNotEmpty({ message: 'A data de inicio não pode ser vazia' })
	@ApiProperty()
	@Transform(({ value }) => new Date(value))
	public startDate: Date;

	@IsDate()
	@MinDate(new Date(), { message: 'A data final não pode ser no passado' })
	@IsNotEmpty({ message: 'A data final não pode ser vazia' })
	@ApiProperty()
	@Transform(({ value }) => new Date(value))
	public endDate: Date;
}
