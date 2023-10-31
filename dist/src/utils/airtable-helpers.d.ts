export declare function getProjectTasks(airtableUrl: string): Promise<{
    todo: number;
    doing: number;
    done: number;
    total: number;
}>;
