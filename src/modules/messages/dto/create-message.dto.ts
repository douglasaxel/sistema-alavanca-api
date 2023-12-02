import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateMessageDto {
	@IsNumber()
	@Min(0, { message: 'O id do projeto deve ser positivo' })
	@IsNotEmpty({ message: 'O id do projeto é obrigatório' })
	@Transform(({ value }) => +value)
	public idProject: number;
}
