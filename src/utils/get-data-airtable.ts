import * as Airtable from 'airtable';

export async function getDataAirtable(appId: string, tableId: string) {
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
