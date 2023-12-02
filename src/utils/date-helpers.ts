type IDateParam = string | Date | number;

export function dateFormatToBr(date: IDateParam) {
	const dateObj = new Date(date);
	const dateFormat = Intl.DateTimeFormat('pt-BR', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		timeZone: 'America/Sao_Paulo',
	});
	return dateFormat.format(dateObj);
}

export function dateTimeFormatToBr(date: IDateParam) {
	const dateObj = new Date(date);
	const dateFormat = Intl.DateTimeFormat('pt-BR', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour12: false,
		hour: '2-digit',
		minute: '2-digit',
		timeZone: 'America/Sao_Paulo',
	});
	return dateFormat.format(dateObj);
}

export function isDateAfter(date: IDateParam, dateToCompare: IDateParam) {
	const date1 = new Date(date).getTime();
	const date2 = new Date(dateToCompare).getTime();

	return date1 > date2;
}

export function isDateBefore(date: IDateParam, dateToCompare: IDateParam) {
	const date1 = new Date(date).getTime();
	const date2 = new Date(dateToCompare).getTime();

	return date1 < date2;
}

interface IValues {
	days?: number;
	months?: number;
	years?: number;
}

export function dateAddOrSub(date: IDateParam, values: IValues) {
	const dateObj = new Date(date);

	if (values.days) dateObj.setDate(dateObj.getDate() + values.days);
	if (values.months) dateObj.setMonth(dateObj.getMonth() + values.months);
	if (values.years) dateObj.setFullYear(dateObj.getFullYear() + values.years);

	return dateObj;
}

export function dateDiffInDays(date: IDateParam, dateToCompare: IDateParam) {
	const startDate = new Date(date).getTime();
	const endDate = new Date(dateToCompare).getTime();

	const diffInMs = endDate - startDate;
	const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

	return Math.ceil(diffInDays);
}

export function dateDiffInHours(date: IDateParam, dateToCompare: IDateParam) {
	const startDate = new Date(date).getTime();
	const endDate = new Date(dateToCompare).getTime();

	const diffInMs = endDate - startDate;
	const diffInHours = diffInMs / (1000 * 60 * 60);

	return Math.abs(Math.round(diffInHours));
}

export function mediaBetweenDates(date1: IDateParam, date2: IDateParam) {
	const today = new Date().getTime();
	const differenceStartEnd = dateDiffInDays(date1, date2);
	const differenceStartToToday = dateDiffInDays(date1, today);
	const result = Math.round(
		(differenceStartToToday * 100) / differenceStartEnd,
	);

	return result > 100 ? 100 : result;
}

export function brDateTimeToEn(stringDate: string) {
	const [day, month, yearTime] = stringDate.split('/');
	const [year, time] = yearTime.split(' ');

	const date = new Date(`${year}-${month}-${day}T${time}:00`);
	return date;
}
