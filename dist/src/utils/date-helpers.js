"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediaBetweenDates = exports.dateDiffInHours = exports.dateDiffInDays = exports.dateAddOrSub = exports.isDateBefore = exports.isDateAfter = exports.dateTimeFormatToBr = exports.dateFormatToBr = void 0;
function dateFormatToBr(date) {
    const dateObj = new Date(date);
    const dateFormat = Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'America/Sao_Paulo',
    });
    return dateFormat.format(dateObj);
}
exports.dateFormatToBr = dateFormatToBr;
function dateTimeFormatToBr(date) {
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
exports.dateTimeFormatToBr = dateTimeFormatToBr;
function isDateAfter(date, dateToCompare) {
    const date1 = new Date(date).getTime();
    const date2 = new Date(dateToCompare).getTime();
    return date1 > date2;
}
exports.isDateAfter = isDateAfter;
function isDateBefore(date, dateToCompare) {
    const date1 = new Date(date).getTime();
    const date2 = new Date(dateToCompare).getTime();
    return date1 < date2;
}
exports.isDateBefore = isDateBefore;
function dateAddOrSub(date, values) {
    const dateObj = new Date(date);
    if (values.days)
        dateObj.setDate(dateObj.getDate() + values.days);
    if (values.months)
        dateObj.setMonth(dateObj.getMonth() + values.months);
    if (values.years)
        dateObj.setFullYear(dateObj.getFullYear() + values.years);
    return dateObj;
}
exports.dateAddOrSub = dateAddOrSub;
function dateDiffInDays(date, dateToCompare) {
    const startDate = new Date(date).getTime();
    const endDate = new Date(dateToCompare).getTime();
    const diffInMs = endDate - startDate;
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    return Math.ceil(diffInDays);
}
exports.dateDiffInDays = dateDiffInDays;
function dateDiffInHours(date, dateToCompare) {
    const startDate = new Date(date).getTime();
    const endDate = new Date(dateToCompare).getTime();
    const diffInMs = endDate - startDate;
    const diffInHours = diffInMs / (1000 * 60 * 60);
    return Math.abs(Math.round(diffInHours));
}
exports.dateDiffInHours = dateDiffInHours;
function mediaBetweenDates(date1, date2) {
    const today = new Date().getTime();
    const differenceStartEnd = dateDiffInDays(date1, date2);
    const differenceStartToToday = dateDiffInDays(date1, today);
    const result = Math.round((differenceStartToToday * 100) / differenceStartEnd);
    return result > 100 ? 100 : result;
}
exports.mediaBetweenDates = mediaBetweenDates;
//# sourceMappingURL=date-helpers.js.map