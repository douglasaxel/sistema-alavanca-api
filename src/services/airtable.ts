import Airtable from 'airtable';

async function getDataAirtable(appId: string, tableId: string) {
	const base = new Airtable({
		apiKey: process.env.AIRTABLE_API_KEY ?? '',
	}).base(appId);

	const results = {};
	const items = await base.table(tableId).select().all();
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

type GetAritableTasksResponse = {
	total: number;
	todo: number;
	doing: number;
	done: number;
};

export async function getProjectTasks(
	airtableUrl: string,
): Promise<GetAritableTasksResponse> {
	try {
		const ids = parseAirtableUrl(airtableUrl);
		const result = await getDataAirtable(ids.appId, ids.tableId);
		return parseTasks(result);
	} catch (err) {
		console.error('airtable', err);
		return {
			total: 0,
			todo: 0,
			doing: 0,
			done: 0,
		};
	}
}
