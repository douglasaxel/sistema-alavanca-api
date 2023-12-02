import { brDateTimeToEn } from './date-helpers';

export function getNumbersFromString(value: string) {
	return value.replace(/(\D)/g, '').replace(/(\d)/, '$1');
}

export function removeSpacesFromString(value: string) {
	return value.replace(/\s/g, '');
}

export function getBase64MimeTypeAndValue(base64: string) {
	const [dataType, b64] = base64.split(',');
	return {
		base64: b64,
		mimeType: dataType.replace(/(data:|;|base64)/g, ''),
	};
}

export interface IMessageBody {
	sentDate: string;
	sender: string;
	message: string;
	attachment?: string | null;
}

export function parseMessagesToJson(texto: string) {
	const messages: IMessageBody[] = [];
	const linhas = texto.split(/\r?\n/);
	let mensagemAtual: IMessageBody = null;

	for (const linha of linhas) {
		const match = linha.match(
			/(\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}) - (.+?): (.+)/,
		);

		if (match) {
			// Se encontrou uma nova mensagem, armazena a mensagem anterior
			if (mensagemAtual) {
				messages.push(mensagemAtual);
			}

			// Inicializa uma nova mensagem
			mensagemAtual = {
				sentDate: brDateTimeToEn(match[1]).toISOString(),
				sender: match[2],
				message: match[3],
				attachment: null, // Inicializa o nome do arquivo como nulo
			};
		} else if (mensagemAtual) {
			// Se não é uma nova mensagem, acrescenta à mensagem atual
			mensagemAtual.message += `\n${linha}`;
		}

		// Verifica se a linha contém o caractere \u200e e "(arquivo anexado)"
		const attachmentMatch = linha.match(
			/\u200e([^\u200e]+)\(arquivo anexado\)/,
		);
		if (attachmentMatch) {
			// Se encontrou um nome de arquivo, atribui à variável attachment
			mensagemAtual.attachment = attachmentMatch[1].trim();
		}
	}

	// Adiciona a última mensagem ao array
	if (mensagemAtual) {
		messages.push(mensagemAtual);
	}

	return messages;
}
