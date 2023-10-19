import { google } from 'googleapis';
// import credentialKeys from '../configs/google-api-key.json';

const credentialKeys = {
	type: 'service_account',
	project_id: 'teste-alavanca',
	private_key_id: '8b21d8a34e0fbbbef4b634a6608ff91d87ae39d5',
	private_key:
		'-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDie1jjj09oekUf\nsYKpVJUfT5yoDgJRyawfH/a0TFWf7XjOaycgNm1EfbwaAkAU3edm67mPM5Cxk59S\nCetOW5gDDocWRf/aw1ltvnlq45hKqGuX5wJ6yAAFsSXMh0S69u5MmSAkPBBoGzps\n4oedXpTAsodbLk0VyzrdZzUDmPglvE91UsKDYYnik6a1452zcIHSZYZnM2l2gitw\nAWMzmxgdhfXzUzW5T2G7wFovSoU1fGfgXDKCY67ODx6SnBUgcV5ASH3OSsNRsdrT\nBrMmotR2I6vpmOqhXryA7PserLqdt1Adyb4192enPge68D3yqNqKulFijoTdbdeu\nJoz0YdIjAgMBAAECggEAbJg4RuSwbqgx/MBgplCoMBs8Qlh1REIvBb2NzWXMqKJ1\nCoTWfdubCPxA9TefAmJkUjU1BDT1bDAcdHnNGgVRHiYZH9TwmTSR7M0n6ti2bRXU\ngUGDLtw3JoOKXEd/7SX5nUDO6JDkTQbBPPRhklOHf94aiN3qmEiaMQ8LnG38jhqW\nC07ReLO/y8YaqGZZ4+lV+rgEQd5YjUCojIvJ5RzGqnKvmo5qdfppQ3yhZ5BKBVKg\nStkyQu/5NTtA0TgU1tBTwI41+SYjwGskX73kGE6ayYbqF8axXuiX1jwakTlb/zRf\nM5dWBtP0GHZOt571mjtS4VpM4FjM6Sbgf86elU+QAQKBgQD1PRDYC/mMOpG1v/ru\nEuhxsnsb+YGTLqlCQFceZVK1LiVAEiSGrzqPTYPso/5ZG1PXCF94dbnp9IGBak5b\nZpT1tbZ44AaJS3+TLLF6bfzlm8VdmP4wQn0YvQlw3208j3J3nBu60HnODUO9/o4F\nEU99YiqRYw7qoE2pzUuEWXRgAwKBgQDsa5MEeXMARF//s69QpsMHfSErZAchAUFF\nXR7gTS+GVJSjAHtJVWG7gb1uSsMqXKmQFQrT47dbOhp4CZmJoyN9x9EvGlruoXKh\nwrrcQVwAYizgDXg9+YVuEnSb3ZYx/n54xH59J6ANgiuAG2zNh8suAAv8ADv5ouUv\nIJoiYbh7YQKBgEoQrFKjozV/xtv+ZDmcykj0X4v+WezqrcHNjsImVclUa3mjQRbQ\nOz5mac6BZOLihvqtk6/c1k5bQvWj9pBSNfDTdY2iEzdJ7vizCdLw/u0Vk5EGENbg\nbcmX5g8J24Lry+Vl51YPeooJpYjvJVNQfBJhIHwST8H6shnzX7hUD/qjAoGBANv3\neuI+3XDyLR+L3yH7BpqBIcttVfSvZjtTWNb4+a7SIzlFyW+BsVz0aXuks9FGRb14\n1oou5PpMJTRqOiCFWRA+SbK5osFEFZPLynADn8X7kiUkYyvGbQ7svPIISSZa0vEq\nYUWxCImJA1A+NA1GuxQhlwTwctzhYrtmagJzSWIBAoGAO37SAavDuxiATVeCSqql\nh3GOhFzHyQUyg5TXN901SKshJgygPszNwkK4VSYHGB1HBGzLWP0X0H+V+g8a20mV\nBK1f4srrl2efNcebNGvzldqSczU0+s5nlCCgWbvuOxP75BFKq9JCRVDEPb6iNuyF\nAj0wwci56YUTSXtw5ZZdwTQ=\n-----END PRIVATE KEY-----\n',
	client_email: 'teste1@teste-alavanca.iam.gserviceaccount.com',
	client_id: '106584934985555747106',
	auth_uri: 'https://accounts.google.com/o/oauth2/auth',
	token_uri: 'https://oauth2.googleapis.com/token',
	auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
	client_x509_cert_url:
		'https://www.googleapis.com/robot/v1/metadata/x509/teste1%40teste-alavanca.iam.gserviceaccount.com',
	universe_domain: 'googleapis.com',
};

const SCOPES = [
	'https://www.googleapis.com/auth/drive',
	'https://www.googleapis.com/auth/calendar',
];
let auth: any | null = null;

async function authorize() {
	if (auth) return auth;

	const jwtClient = new google.auth.JWT(
		credentialKeys.client_email,
		null,
		credentialKeys.private_key,
		SCOPES,
	);
	await jwtClient.authorize();
	auth = jwtClient;

	return jwtClient;
}

export async function listDriveFiles(folderId: string) {
	const authClient = await authorize();
	const drive = google.drive({ version: 'v3', auth: authClient });
	const res = await drive.files.list({
		fields: 'files(id, name, fileExtension, mimeType, webViewLink, iconLink)',
		q: `'${folderId}' in parents`,
	});
	const files = res.data.files;

	if (files.length === 0) return [];
	return files;
}

export async function createDriveFile(folderName: string) {
	const authClient = await authorize();
	const drive = google.drive({ version: 'v3', auth: authClient });
	const folder = await drive.files.create({
		requestBody: {
			name: folderName,
			mimeType: 'application/vnd.google-apps.folder',
			parents: ['1L6vjs21M4qIu23NxZaUvzhMqmoSyfuy-'],
		},
		fields: 'id',
	});

	return folder.data.id;
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

export async function listCalendarEvents() {
	const authClient = await authorize();
	const calendar = google.calendar({ version: 'v3', auth: authClient });

	const events = await calendar.events.list({
		calendarId: 'primary',
		timeMin: new Date().toISOString(),
		singleEvents: true,
		orderBy: 'startTime',
	});

	return events.data.items.map(item => ({
		id: item.id,
		summary: item.summary,
		start: item.start,
		end: item.end,
		meetUrl: item.hangoutLink,
	}));
}
