import { useMemo } from "react";
import "./App.css";
import { Day, days } from "./DayTypes";
import {
  areDaysTheSame,
  getDatesForMonth,
  getDayMonthStartsOn,
  getTodaysDate,
} from "./dateUtils";
import { KalendarProvider, useKalendar } from "./KalendarContext";
import { capitalize } from "./stringManipulation";
import { Button } from "./Button/Button";

function App() {
  return <Kalendar size="small" />;
}

export type Size = "default" | "small";

const Kalendar = ({ date, size = "default" }: { date?: Date; size?: Size }) => {
  const smallClassName = size === "small" ? "grid__week--small" : "";

  return (
    <KalendarProvider date={date} size={size}>
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

const DayLabels = ({ abbreviation = true }: { abbreviation?: boolean }) => {
  return days.map((day) => (
    <DayLabel
      day={capitalize(abbreviation ? day.substring(0, 2) : day)}
      key={day}
    />
  ));
};

const DayLabel = ({ day }: { day: Day | string }) => {
  return <div className="day__label">{day}</div>;
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
  const blankStartingDays = getDayMonthStartsOn(date).index;
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
  const { selectedDate, selectDate, size } = useKalendar();
  const number = date.getDate();

  const isDateSelected = areDaysTheSame(selectedDate as Date, date);

  const dateLabel: string = date.toLocaleDateString("en", {
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
  const { date, size } = useKalendar();

  const monthHeader = date.toLocaleString("en", { month: "long" });

  return (
    <Button use="text" size={size}>
      {monthHeader} {date.getUTCFullYear()}
    </Button>
  );
};

export default App;
