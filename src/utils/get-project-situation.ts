import { ProjectStatus } from '@prisma/client';
import { isDateAfter, mediaBetweenDates } from './date-helpers';

type IGetProjectSituationParams = {
	startDate: string;
	endDate: string;
	tasks: {
		done: number;
		total: number;
	};
};

function isoDateToDateObj(isoDate: string) {
	const [dateA] = isoDate.split('T');
	const [year, month, day] = dateA.split('-');
	const dateObj = new Date(+year, +month - 1, +day);
	return dateObj;
}

export function getProjectSituation({
	startDate,
	endDate,
	tasks,
}: IGetProjectSituationParams) {
	const sDate = isoDateToDateObj(startDate);
	const eDate = isoDateToDateObj(endDate);
	const isAfter = isDateAfter(Date.now(), eDate);
	const isTasksDone = tasks.done >= tasks.total;
	let status: ProjectStatus = 'PENDING';
	let progress = mediaBetweenDates(sDate, eDate);

	if (isTasksDone) {
		status = 'FINISHED';
		progress = 100;
	}
	if (isAfter && !isTasksDone) {
		status = 'LATE';
	}

	return { status, progress };
}
