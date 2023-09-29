import { ReactElement, createContext, useContext, useState } from "react";
import { KalendarProps } from "./App";
import {
  areDaysTheSame,
  getNextMonth,
  getPreviousMonth,
  getTodaysDate,
} from "./dateUtils";

type KalendarContext = Required<
  Pick<KalendarProps, "value" | "date" | "size" | "locale">
> & {
  previousMonth: () => void;
  nextMonth: () => void;
  selectDate: (date: Date) => void;
};

const KalendarContext = createContext<KalendarContext | undefined>(undefined);

export const useKalendar = () => {
  const context = useContext(KalendarContext);

  if (context === undefined) {
    throw new Error(
      "useKalendarContext must be used within a KalendarProvider"
    );
  }

  return context;
};

type KalendarProviderProps = KalendarProps & {
  children: ReactElement | (ReactElement | null)[];
};

export const KalendarProvider = ({
  value,
  onChange,
  date: providedDate = getTodaysDate(),
  size = "default",
  locale = getPreferredLanguage() ?? "en",
  children,
}: KalendarProviderProps) => {
  const [date, setDate] = useState<Date>(providedDate);

  const previousMonth = () => {
    setDate((date) => getPreviousMonth(date));
  };

  const nextMonth = () => {
    setDate((date) => getNextMonth(date));
  };

  const selectDate = (date: Date) => {
    onChange((previousDate) => {
      const shouldSelectDate =
        previousDate === null || !areDaysTheSame(previousDate, date);

      return shouldSelectDate ? date : null;
    });
  };

  return (
    <KalendarContext.Provider
      value={{
        value,
        date,
        size,
        locale,
        previousMonth,
        nextMonth,
        selectDate,
      }}
    >
      {children}
    </KalendarContext.Provider>
  );
};

const getPreferredLanguage = () => {
  if (navigator.languages !== undefined) {
    return navigator.languages[0];
  }

  return navigator.language;
};
