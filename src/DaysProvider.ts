import { Day, days } from "./DayTypes";

export class DaysProvider {
  static getDaysInMonth(date: Date = this.getTodaysDate()): number {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }

  static getTodaysDate(): Date {
    return new Date();
  }

  static getDayMonthStartsOn(date: Date = this.getTodaysDate()): {
    day: Day;
    index: number;
  } {
    const firstDayOfTheMonth = DaysProvider.getFirstDayOfTheMonthDate(date);
    const index = firstDayOfTheMonth.getDay() - 1;

    return {
      day: days[index],
      index,
    };
  }

  static getDatesForMonth = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();

    return Array.from(
      { length: DaysProvider.getDaysInMonth(date) },
      (_, i) => new Date(year, month, i + 1)
    );
  };

  static getFirstDayOfTheMonthDate = (date: Date): Date => {
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), 1);
  };

  static getPreviousMonth(date: Date): Date {
    return DaysProvider.subtractMonths(date, 1);
  }

  static getNextMonth(date: Date): Date {
    return DaysProvider.addMonths(date, 1);
  }

  static subtractMonths(date: Date, months: number): Date {
    const newDate = new Date(date);

    newDate.setMonth(newDate.getMonth() - months);

    return newDate;
  }

  static addMonths(date: Date, months: number): Date {
    const newDate = new Date(date);

    newDate.setMonth(newDate.getMonth() + months);

    return newDate;
  }

  static areDatesTheSame(date1: Date, date2: Date) {
    return date1?.getTime() === date2?.getTime();
  }

  static areDaysTheSame(date1: Date, date2: Date) {
    return (
      date1?.getFullYear() === date2?.getFullYear() &&
      date1?.getMonth() === date2?.getMonth() &&
      date1?.getDate() === date2?.getDate()
    );
  }
}
