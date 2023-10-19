import * as Airtable from 'airtable';

async function getDataAirtable(appId: string, tableId: string) {
	const table = new Airtable({
		apiKey: process.env.AIRTABLE_API_KEY ?? '',
	}).base(appId);

	const results = {};
	const items = await table.table(tableId).select().all();
	items.forEach(item => {
		if (item.fields.Status) {
			const status = item.fields.Status as string;
			results[status] = results[status] ? results[status] + 1 : 1;
		}
	});

	return results;
}

interface IParseOutput {
	appId: string;
	tableId: string;
	viewId: string;
}

function parseAirtableUrl(url: string): IParseOutput {
	const a = new URL(url);
	const [, appId, tableId, viewId] = a.pathname.split('/');

	return { appId, tableId, viewId };
}

function parseTasks(tasks: Record<string, number>) {
	const todo = tasks['Todo'] ?? 0;
	const doing = tasks['In progress'] ?? 0;
	const done = tasks['Done'] ?? 0;

	const total = todo + doing + done;

	return { todo, doing, done, total };
}

export async function getProjectTasks(airtableUrl: string) {
	const ids = parseAirtableUrl(airtableUrl);
	const result = await getDataAirtable(ids.appId, ids.tableId);

	return parseTasks(result);
}
