interface IParseOutput {
	appId: string;
	tableId: string;
	viewId: string;
}

export function parseAirtableUrl(url: string): IParseOutput {
	const a = new URL(url);
	const [, appId, tableId, viewId] = a.pathname.split('/');

	return { appId, tableId, viewId };
}
