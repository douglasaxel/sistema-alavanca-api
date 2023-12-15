import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CollaboratorsService } from '../collaborators/collaborators.service';

@Module({
	controllers: [UsersController],
	providers: [UsersService, CollaboratorsService],
})
export class UsersModule {}
