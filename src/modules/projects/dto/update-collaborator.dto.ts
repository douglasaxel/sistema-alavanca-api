import { IsNumber, IsOptional } from 'class-validator';
import { CreateCollaboratorDto } from './create-collaborator.dto';

export class UpdateCollaboratorDto extends CreateCollaboratorDto {
	@IsNumber()
	@IsOptional()
	public id?: number;
}
