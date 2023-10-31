"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGoogleCalendarEvent = exports.listCalendarEvents = exports.copyFilesToNewFolder = exports.createDriveFile = exports.createDriveFolder = exports.listDriveFiles = void 0;
const crypto_1 = require("crypto");
const googleapis_1 = require("googleapis");
const promises_1 = require("fs/promises");
const path_1 = __importDefault(require("path"));
const stream_1 = require("stream");
const SCOPES = [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/calendar',
];
let auth = null;
async function readKeys() {
    const file = await (0, promises_1.readFile)(path_1.default.resolve(process.cwd(), 'google-api-key.json'), { encoding: 'utf-8' });
    return JSON.parse(file);
}
async function authorize() {
    if (auth)
        return auth;
    const credentialKeys = await readKeys();
    const jwtClient = new googleapis_1.google.auth.JWT(credentialKeys.client_email, null, credentialKeys.private_key, SCOPES, process.env.GOOGLE_IMPERSONATED_EMAIL);
    await jwtClient.authorize();
    auth = jwtClient;
    return jwtClient;
}
async function listDriveFiles(folderId) {
    const authClient = await authorize();
    const drive = googleapis_1.google.drive({ version: 'v3', auth: authClient });
    const res = await drive.files.list({
        fields: 'files(id, name, fileExtension, mimeType, webViewLink, iconLink)',
        q: `'${folderId}' in parents`,
    });
    const files = res.data.files;
    if (files.length === 0)
        return [];
    return files;
}
exports.listDriveFiles = listDriveFiles;
async function createDriveFolder(folderName) {
    const authClient = await authorize();
    const drive = googleapis_1.google.drive({ version: 'v3', auth: authClient });
    const folder = await drive.files.create({
        requestBody: {
            name: folderName,
            mimeType: 'application/vnd.google-apps.folder',
            parents: [
                '1g69Ixhuz_ekuDfBwd4M6sv_Dj1HNZeUO',
            ],
        },
        fields: 'id',
    });
    return folder.data.id;
}
exports.createDriveFolder = createDriveFolder;
async function createDriveFile({ fileBase64, name, mimeType, type, }) {
    const authClient = await authorize();
    const drive = googleapis_1.google.drive({ version: 'v3', auth: authClient });
    const buffer = Buffer.from(fileBase64, 'base64');
    const bufferStream = new stream_1.PassThrough();
    bufferStream.end(buffer);
    const newFile = await drive.files.create({
        media: {
            mimeType,
            body: bufferStream,
        },
        requestBody: {
            name: `${(0, crypto_1.randomBytes)(8).toString('hex')} - ${name}`,
            parents: [
                type === 'user'
                    ? '1SycjKjUo2RwfOFO2ZHSGRbwnaBdJ6b5p'
                    : '1H68ALlZTsrPrbaDIUXRkOlUsM6CdScyt',
            ],
        },
        fields: 'id',
    });
    const responseFile = await drive.files.get({
        fileId: newFile.data.id,
        fields: 'thumbnailLink',
    });
    return responseFile.data.thumbnailLink;
}
exports.createDriveFile = createDriveFile;
async function copyFilesToNewFolder(fromFolderId, toFolderId) {
    const authClient = await authorize();
    const drive = googleapis_1.google.drive({ version: 'v3', auth: authClient });
    const filesToCopy = await listDriveFiles(fromFolderId);
    const filesToCopyIds = filesToCopy.map(f => f.id);
    const promises = filesToCopyIds.map(id => drive.files.copy({
        fileId: id,
        requestBody: {
            parents: [toFolderId],
        },
    }));
    await Promise.all(promises);
}
exports.copyFilesToNewFolder = copyFilesToNewFolder;
async function listCalendarEvents(projectName) {
    const authClient = await authorize();
    const calendar = googleapis_1.google.calendar({ version: 'v3', auth: authClient });
    const events = await calendar.events.list({
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        maxResults: 100,
        singleEvents: true,
        orderBy: 'startTime',
    });
    return events.data.items.flatMap(item => {
        if (!item.summary
            .toLocaleLowerCase()
            .includes(projectName.toLocaleLowerCase())) {
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
exports.listCalendarEvents = listCalendarEvents;
async function createGoogleCalendarEvent(projectName, startDate, endDate, attendees) {
    const authClient = await authorize();
    const calendar = googleapis_1.google.calendar({ version: 'v3', auth: authClient });
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
                        requestId: (0, crypto_1.randomBytes)(12).toString('hex'),
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
    }
    catch (err) {
        console.error(err);
        console.log({
            name: err.message,
            code: err.code,
            data: err.response?.data,
        });
    }
}
exports.createGoogleCalendarEvent = createGoogleCalendarEvent;
//# sourceMappingURL=googleapi.js.map