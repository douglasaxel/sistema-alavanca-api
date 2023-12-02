import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { ProjectsService } from '../projects/projects.service';

@Module({
	controllers: [MessagesController],
	providers: [MessagesService, ProjectsService],
})
export class MessagesModule {}
