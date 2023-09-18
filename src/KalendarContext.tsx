import { ReactElement, createContext, useContext, useState } from "react";
import { DaysProvider } from "./DaysProvider";

type KalendarContext = {
  date: Date;
  selectedDate: Date | null;
  previousMonth: () => void;
  nextMonth: () => void;
  selectDate: (date: Date) => void;
};

const defaultDateContextState: KalendarContext = {
  date: DaysProvider.getTodaysDate(),
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
  children,
}: {
  children: ReactElement | ReactElement[];
}) => {
  const [date, setDate] = useState<Date>(defaultDateContextState.date);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const previousMonth = () => {
    setDate((date) => DaysProvider.getPreviousMonth(date));
  };

  const nextMonth = () => {
    setDate((date) => DaysProvider.getNextMonth(date));
  };

  const selectDate = (date: Date) => {
    setSelectedDate((previousDate) => {
      const shouldSelectDate =
        previousDate === null ||
        !DaysProvider.areDatesTheSame(previousDate, date);

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
