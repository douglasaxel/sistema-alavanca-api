import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Query,
	NotFoundException,
	BadRequestException,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { parseMessagesToJson } from 'src/utils/string-helper';
import { UserRoles } from '../roles/roles.enum';
import { Roles } from '../roles/roles.decorator';
import { CreateMessageDto } from './dto/create-message.dto';
import { ProjectsService } from '../projects/projects.service';
import { listDriveFiles } from 'src/services/googleapi';

@Controller('messages')
export class MessagesController {
	constructor(
		private readonly messagesService: MessagesService,
		private readonly projectsService: ProjectsService,
	) {}

	@Roles(UserRoles.ADMIN, UserRoles.MASTER)
	@Post()
	async create(
		@Body('text') text: string,
		@Query() { idProject }: CreateMessageDto,
	) {
		const project = await this.projectsService.findOne(idProject);
		if (!project) {
			throw new NotFoundException(['Este projeto não existe']);
		}

		const [messagesFolder] = await listDriveFiles(
			project.driveFolderId,
			"name = 'conversa'",
		);

		if (!messagesFolder) {
			throw new BadRequestException([
				"A pasta 'conversa' não existe no drive do projeto",
				"Crie uma pasta com o nome 'conversa' manualmente e tente salvar as mensagens novamente.",
			]);
		}

		const messageDriveFiles = await listDriveFiles(messagesFolder.id);
		const messages = parseMessagesToJson(text);

		for (const message of messages) {
			if (message.attachment) {
				const attachmentLink = messageDriveFiles.find(file =>
					file.name.includes(message.attachment),
				);

				message.attachment = attachmentLink.webViewLink;
			}
		}

		return this.messagesService.create(idProject, messages);
	}

	@Get(':idProject')
	listProjectMessages(@Param('idProject') idProject: number) {
		if (isNaN(+idProject)) {
			throw new BadRequestException(['O id do projeto é inválido'])
		}
		return this.messagesService.listProjectMessages(+idProject);
	}
}
