import { useMemo, useState } from "react";
import "./App.css";
import { Day } from "./DayTypes";
import {
  areDaysTheSame,
  getDatesForMonth,
  getDayIndexMonthStartsOn,
  getTodaysDate,
  getWeekDays,
} from "./dateUtils";
import { KalendarProvider, useKalendar } from "./KalendarContext";
import { capitalize } from "./stringManipulation";
import { Button } from "./Button/Button";

function App() {
  const [date, setDate] = useState<Date | null>(null);

  return <Kalendar value={date} onChange={setDate} locale="en" size="small" />;
}

export type Value = Date | null;

export type Size = "default" | "small";

export type KalendarProps = {
  value: Date | null;
  onChange: React.Dispatch<React.SetStateAction<Value>>;
  date?: Date;
  size?: Size;
  locale?: Intl.LocalesArgument;
};

const Kalendar = (props: KalendarProps) => {
  const smallClassName = props.size === "small" ? "grid__week--small" : "";

  return (
    <KalendarProvider {...props}>
      <Actions />
      <div className={`grid grid__week ${smallClassName}`}>
        <DayLabels />
      </div>

      <div className="grid">
        <DaysGrid />
      </div>
    </KalendarProvider>
  );
};

const DayLabels = () => {
  const { locale } = useKalendar();

  const weekDays = useMemo(() => getWeekDays(locale), [locale]);

  return weekDays.map((day) => (
    <DayLabel day={day.substring(0, 2)} key={day} />
  ));
};

const DayLabel = ({ day }: { day: Day | string }) => {
  return <div>{day}</div>;
};

const DaysGrid = () => {
  const { date } = useKalendar();

  const dates = useMemo(() => getDatesForMonth(date), [date]);

  const todaysDateIndex: number | null = useMemo(() => {
    const todaysDate = getTodaysDate();

    for (let i = 0; i < dates.length; i++) {
      if (areDaysTheSame(dates[i], todaysDate)) {
        return i;
      }
    }

    return null;
  }, [dates]);

  return [
    ...getBlankDays(date),
    ...dates.map((date, i) => (
      <DayNumber
        date={date}
        isTodaysDate={todaysDateIndex === i}
        key={date.toString()}
      />
    )),
  ];
};

const getBlankDays = (date: Date): JSX.Element[] => {
  const blankStartingDays = getDayIndexMonthStartsOn(date);
  const blanks = Array.from({ length: blankStartingDays }, () => "");

  return blanks.map((_, i) => <span key={`blank_${i}`} />);
};

const DayNumber = ({
  date,
  isTodaysDate,
}: {
  date: Date;
  isTodaysDate: boolean;
}) => {
  const { value, selectDate, size, locale } = useKalendar();
  const number = date.getDate();

  const isDateSelected = areDaysTheSame(value as Date, date);

  const dateLabel: string = date.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Button
      use="text"
      size={size}
      onClick={() => selectDate(date)}
      aria-label={dateLabel}
      className={`${isDateSelected ? "btn--active" : ""} ${
        isTodaysDate ? "btn--highlighted" : ""
      }`}
    >
      {number}
    </Button>
  );
};

const Actions = () => {
  const { previousMonth, nextMonth, size } = useKalendar();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Button onClick={previousMonth} aria-label="previous month" size={size}>
        {"←"}
      </Button>
      <HeaderButton />
      <Button onClick={nextMonth} aria-label="next month" size={size}>
        {"→"}
      </Button>
    </div>
  );
};

const HeaderButton = () => {
  const { date, size, locale } = useKalendar();

  const monthHeader = capitalize(
    date.toLocaleString(locale, { month: "long" })
  );

  return (
    <Button use="text" size={size}>
      {monthHeader} {date.getUTCFullYear()}
    </Button>
  );
};

export default App;
