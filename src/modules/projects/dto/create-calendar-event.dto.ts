import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty } from 'class-validator';

export class CreateCalendarEventDto {
	@IsDate()
	@IsNotEmpty({ message: 'A data de inicio não pode ser vazia' })
	@ApiProperty()
	@Transform(({ value }) => new Date(value))
	public startDate: Date;

	@IsDate()
	@IsNotEmpty({ message: 'A data final não pode ser vazia' })
	@ApiProperty()
	@Transform(({ value }) => new Date(value))
	public endDate: Date;
}
