type IDateParam = string | Date | number;
export declare function dateFormatToBr(date: IDateParam): string;
export declare function dateTimeFormatToBr(date: IDateParam): string;
export declare function isDateAfter(date: IDateParam, dateToCompare: IDateParam): boolean;
export declare function isDateBefore(date: IDateParam, dateToCompare: IDateParam): boolean;
interface IValues {
    days?: number;
    months?: number;
    years?: number;
}
export declare function dateAddOrSub(date: IDateParam, values: IValues): Date;
export declare function dateDiffInDays(date: IDateParam, dateToCompare: IDateParam): number;
export declare function dateDiffInHours(date: IDateParam, dateToCompare: IDateParam): number;
export declare function mediaBetweenDates(date1: IDateParam, date2: IDateParam): number;
export {};
