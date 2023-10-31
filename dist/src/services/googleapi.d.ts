export declare function listDriveFiles(folderId: string): Promise<import("googleapis").drive_v3.Schema$File[]>;
export declare function createDriveFolder(folderName: string): Promise<string>;
interface CreateDriveFileParams {
    fileBase64: string;
    name: string;
    mimeType: string;
    type: 'user' | 'customer';
}
export declare function createDriveFile({ fileBase64, name, mimeType, type, }: CreateDriveFileParams): Promise<string>;
export declare function copyFilesToNewFolder(fromFolderId: string, toFolderId: string): Promise<void>;
export declare function listCalendarEvents(projectName: string): Promise<any[]>;
export declare function createGoogleCalendarEvent(projectName: string, startDate: Date, endDate: Date, attendees: string[]): Promise<void>;
export {};
