import { ReactElement, createContext, useContext, useState } from "react";
import {
  areDatesTheSame,
  getNextMonth,
  getPreviousMonth,
  getTodaysDate,
} from "./dateUtils";

type KalendarContext = {
  date: Date;
  selectedDate: Date | null;
  previousMonth: () => void;
  nextMonth: () => void;
  selectDate: (date: Date) => void;
};

const defaultDateContextState: KalendarContext = {
  date: getTodaysDate(),
  selectedDate: null,
  previousMonth: undefined as unknown as () => void,
  nextMonth: undefined as unknown as () => void,
  selectDate: undefined as unknown as (date: Date) => void,
};

const KalendarContext = createContext<KalendarContext | undefined>(
  defaultDateContextState
);

export const useKalendar = () => {
  const context = useContext(KalendarContext);

  if (context === undefined) {
    throw new Error(
      "useKalendarContext must be used within a KalendarProvider"
    );
  }

  return context;
};

export const KalendarProvider = ({
  date: providedDate,
  children,
}: {
  date?: Date;
  children: ReactElement | ReactElement[];
}) => {
  const [date, setDate] = useState<Date>(
    providedDate ?? defaultDateContextState.date
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    providedDate ?? null
  );

  console.log("selected", selectedDate);

  const previousMonth = () => {
    setDate((date) => getPreviousMonth(date));
  };

  const nextMonth = () => {
    setDate((date) => getNextMonth(date));
  };

  const selectDate = (date: Date) => {
    setSelectedDate((previousDate) => {
      const shouldSelectDate =
        previousDate === null || !areDatesTheSame(previousDate, date);

      return shouldSelectDate ? date : null;
    });
  };

  return (
    <KalendarContext.Provider
      value={{ date, selectedDate, previousMonth, nextMonth, selectDate }}
    >
      {children}
    </KalendarContext.Provider>
  );
};
