"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjectTasks = void 0;
const airtable_1 = __importDefault(require("airtable"));
async function getDataAirtable(appId, tableId) {
    const table = new airtable_1.default({
        apiKey: process.env.AIRTABLE_API_KEY ?? '',
    }).base(appId);
    const results = {};
    const items = await table.table(tableId).select().all();
    items.forEach(item => {
        if (item.fields.Status) {
            const status = item.fields.Status;
            results[status] = results[status] ? results[status] + 1 : 1;
        }
    });
    return results;
}
function parseAirtableUrl(url) {
    const a = new URL(url);
    const [, appId, tableId, viewId] = a.pathname.split('/');
    return { appId, tableId, viewId };
}
function parseTasks(tasks) {
    const todo = tasks['Todo'] ?? 0;
    const doing = tasks['In progress'] ?? 0;
    const done = tasks['Done'] ?? 0;
    const total = todo + doing + done;
    return { todo, doing, done, total };
}
async function getProjectTasks(airtableUrl) {
    const ids = parseAirtableUrl(airtableUrl);
    const result = await getDataAirtable(ids.appId, ids.tableId);
    return parseTasks(result);
}
exports.getProjectTasks = getProjectTasks;
//# sourceMappingURL=airtable-helpers.js.map