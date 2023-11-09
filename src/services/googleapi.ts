import { randomBytes } from 'crypto';
import { google } from 'googleapis';
import { readFile } from 'fs/promises';
import path from 'path';
import { PassThrough } from 'stream';

const SCOPES = [
	'https://www.googleapis.com/auth/drive',
	'https://www.googleapis.com/auth/calendar',
	// 'https://www.googleapis.com/auth/calendar.events',
];
let auth: any | null = null;

async function readKeys() {
	const file = await readFile(
		path.resolve(process.cwd(), 'google-api-key.json'),
		{ encoding: 'utf-8' },
	);
	return JSON.parse(file);
}

async function authorize() {
	if (auth) return auth;
	const credentialKeys = await readKeys();

	const jwtClient = new google.auth.JWT(
		credentialKeys.client_email,
		null,
		credentialKeys.private_key,
		SCOPES,
		process.env.GOOGLE_IMPERSONATED_EMAIL,
	);
	await jwtClient.authorize();
	auth = jwtClient;

	return jwtClient;
}

export async function listDriveFiles(folderId: string) {
	const authClient = await authorize();
	const drive = google.drive({ version: 'v3', auth: authClient });
	const res = await drive.files.list({
		fields:
			'files(id, name, fileExtension, mimeType, webViewLink, iconLink, thumbnailLink)',
		q: `'${folderId}' in parents`,
	});
	const files = res.data.files;

	if (files.length === 0) return [];
	return files;
}

export async function createDriveFolder(folderName: string) {
	const authClient = await authorize();
	const drive = google.drive({ version: 'v3', auth: authClient });
	const folder = await drive.files.create({
		requestBody: {
			name: folderName,
			mimeType: 'application/vnd.google-apps.folder',
			parents: [
				process.env.GOOGLE_BASE_FOLDER, // Pasta: Sistema Alavanca
			],
		},
		fields: 'id',
	});

	return folder.data.id;
}

interface CreateDriveFileParams {
	fileBase64: string;
	name: string;
	mimeType: string;
	type: 'user' | 'customer';
}

export async function createDriveFile({
	fileBase64,
	name,
	mimeType,
	type,
}: CreateDriveFileParams) {
	const authClient = await authorize();
	const drive = google.drive({ version: 'v3', auth: authClient });

	const buffer = Buffer.from(fileBase64, 'base64');
	const bufferStream = new PassThrough();
	bufferStream.end(buffer);

	const newFile = await drive.files.create({
		media: {
			mimeType,
			body: bufferStream,
		},
		requestBody: {
			name: `${randomBytes(8).toString('hex')} - ${name}`,
			parents: [
				type === 'user'
					? process.env.GOOGLE_USERS_FOLDER // Pasta: Usuários
					: process.env.GOOGLE_CUSTOMERS_FOLDER, // Pasta: Clientes
			],
		},
		fields: 'id',
	});

	const responseFile = await drive.files.get({
		fileId: newFile.data.id,
		fields: 'thumbnailLink',
		// 'linkShareMetadata,iconLink,exportLinks,webViewLink,thumbnailLink,webContentLink',
	});

	return responseFile.data.thumbnailLink;
}

export async function copyFilesToNewFolder(
	fromFolderId: string,
	toFolderId: string,
) {
	const authClient = await authorize();
	const drive = google.drive({ version: 'v3', auth: authClient });

	const filesToCopy = await listDriveFiles(fromFolderId);
	const filesToCopyIds = filesToCopy.map(f => f.id);
	const promises = filesToCopyIds.map(id =>
		drive.files.copy({
			fileId: id,
			requestBody: {
				parents: [toFolderId],
			},
		}),
	);

	await Promise.all(promises);
}

export async function listCalendarEvents(projectName: string) {
	const authClient = await authorize();
	const calendar = google.calendar({ version: 'v3', auth: authClient });

	const events = await calendar.events.list({
		calendarId: 'primary',
		timeMin: new Date().toISOString(),
		maxResults: 100,
		singleEvents: true,
		orderBy: 'startTime',
	});

	return events.data.items.flatMap(item => {
		if (
			!item.summary
				.toLocaleLowerCase()
				.includes(projectName.toLocaleLowerCase())
		) {
			return [];
		}

		console.log(item);

		return {
			id: item.id,
			summary: item.summary,
			start: item.start,
			end: item.end,
			meetUrl: item.hangoutLink,
		};
	});
}

export async function createGoogleCalendarEvent(
	projectName: string,
	startDate: Date,
	endDate: Date,
	attendees: string[],
) {
	const authClient = await authorize();
	const calendar = google.calendar({ version: 'v3', auth: authClient });

	try {
		await calendar.events.insert({
			calendarId: 'primary',
			conferenceDataVersion: 1,
			requestBody: {
				summary: `Alavanca reunião: ${projectName}`,
				description: `Reunião sobre o projeto: ${projectName}`,
				start: {
					dateTime: startDate.toISOString(),
					timeZone: 'America/Sao_Paulo',
				},
				end: {
					dateTime: endDate.toISOString(),
					timeZone: 'America/Sao_Paulo',
				},
				eventType: 'default',
				anyoneCanAddSelf: true,
				guestsCanInviteOthers: true,
				guestsCanSeeOtherGuests: true,
				conferenceData: {
					createRequest: {
						requestId: randomBytes(12).toString('hex'),
					},
				},
				attendees: attendees.map(email => ({ email })),
				reminders: {
					useDefault: false,
					overrides: [
						{ method: 'popup', minutes: 30 },
						{ method: 'popup', minutes: 5 },
						{ method: 'email', minutes: 30 },
						{ method: 'email', minutes: 5 },
					],
				},
			},
		});
	} catch (err) {
		console.error(err);
		console.log({
			name: err.message,
			code: err.code,
			data: err.response?.data,
		});
	}
}
