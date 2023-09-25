import { ReactElement, createContext, useContext, useState } from "react";
import { KalendarProps } from "./App";
import {
  areDatesTheSame,
  getNextMonth,
  getPreviousMonth,
  getTodaysDate,
} from "./dateUtils";

type KalendarContext = Required<
  Pick<KalendarProps, "value" | "date" | "size">
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
  children: ReactElement | ReactElement[];
};

export const KalendarProvider = ({
  value,
  onChange,
  date: providedDate = getTodaysDate(),
  size = "default",
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
        previousDate === null || !areDatesTheSame(previousDate, date);

      return shouldSelectDate ? date : null;
    });
  };

  return (
    <KalendarContext.Provider
      value={{
        value,
        date,
        size,
        previousMonth,
        nextMonth,
        selectDate,
      }}
    >
      {children}
    </KalendarContext.Provider>
  );
};
