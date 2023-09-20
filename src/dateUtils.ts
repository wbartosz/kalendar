import { Day, days } from "./DayTypes";

export function getDaysInMonth(date: Date = getTodaysDate()): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

export function getTodaysDate(): Date {
  return new Date();
}

export function getDayMonthStartsOn(date: Date = getTodaysDate()): {
  day: Day;
  index: number;
} {
  const firstDayOfTheMonth = getFirstDayOfTheMonthDate(date);
  const index = firstDayOfTheMonth.getDay() - 1;

  return {
    day: days[index],
    index,
  };
}

export function getDatesForMonth(date: Date): Date[] {
  const year = date.getFullYear();
  const month = date.getMonth();

  return Array.from(
    { length: getDaysInMonth(date) },
    (_, i) => new Date(year, month, i + 1)
  );
}

export function getFirstDayOfTheMonthDate(date: Date): Date {
  return new Date(date.getUTCFullYear(), date.getUTCMonth(), 1);
}

export function getPreviousMonth(date: Date): Date {
  return subtractMonths(date, 1);
}

export function getNextMonth(date: Date): Date {
  return addMonths(date, 1);
}

export function subtractMonths(date: Date, months: number): Date {
  const newDate = new Date(date);

  newDate.setMonth(newDate.getMonth() - months);

  return newDate;
}

export function addMonths(date: Date, months: number): Date {
  const newDate = new Date(date);

  newDate.setMonth(newDate.getMonth() + months);

  return newDate;
}

export function areDatesTheSame(date1: Date, date2: Date): boolean {
  return date1?.getTime() === date2?.getTime();
}

export function areDaysTheSame(date1: Date, date2: Date): boolean {
  return (
    date1?.getFullYear() === date2?.getFullYear() &&
    date1?.getMonth() === date2?.getMonth() &&
    date1?.getDate() === date2?.getDate()
  );
}
