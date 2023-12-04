import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

interface IMessage {
	message: string;
	sender: string;
	sentDate: string;
	attachment?: string | null;
}

@Injectable()
export class MessagesService {
	constructor(private prismaService: PrismaService) {}

	async create(idProject: number, messages: IMessage[]) {
		const exist = await this.prismaService.project.findUnique({
			where: { id: idProject },
		});

		if (!exist) {
			throw new BadRequestException(['Este projeto não existe']);
		}

		return this.prismaService.message.createMany({
			data: messages.map(message => ({
				...message,
				idProject,
			})),
		});
	}

	async listProjectMessages(idProject: number) {
		const messages = await this.prismaService.message.findMany({
			where: { idProject }
		})
		const groupMessages: Record<string, typeof messages> = {};

		messages.forEach(message => {
			const key = message.createdAt.toISOString().substring(0, 10);

				groupMessages[key] = [
					...(groupMessages[key] ?? []),
					message,
				]
		})

		return groupMessages
	}
}
