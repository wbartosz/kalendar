import {
  cloneElement,
  Children,
  ReactElement,
  CSSProperties,
  ReactNode,
  useMemo,
} from "react";
import "./App.css";
import { Day, days } from "./DayTypes";
import { DaysProvider } from "./DaysProvider";
import { KalendarProvider, useKalendar } from "./KalendarContext";
import { capitalize } from "./stringManipulation";

function App() {
  return <Kalendar />;
}

const Kalendar = () => {
  return (
    <KalendarProvider>
      <Actions />
      <Grid
        style={{
          marginBottom: 8,
          color: "#a5a5a5",
          height: 40,
          alignItems: "center",
        }}
      >
        <DayLabels />
      </Grid>
      <Grid>
        <DaysGrid />
      </Grid>
    </KalendarProvider>
  );
};

const Grid = ({
  children,
  style,
}: {
  children: ReactElement | ReactElement[];
  style?: CSSProperties;
}) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
        gap: 10,
        ...style,
      }}
    >
      {Children.map(children, (child) => cloneElement(child))}
    </div>
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
  return <Cell>{day}</Cell>;
};

const Cell = ({ children }: { children: ReactNode }) => {
  return <span>{children}</span>;
};

const DaysGrid = () => {
  const { date } = useKalendar();

  const dates = useMemo(() => DaysProvider.getDatesForMonth(date), [date]);

  const todaysDateIndex: number | null = useMemo(() => {
    const todaysDate = DaysProvider.getTodaysDate();

    for (let i = 0; i < dates.length; i++) {
      if (DaysProvider.areDaysTheSame(dates[i], todaysDate)) {
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
  const blankStartingDays = DaysProvider.getDayMonthStartsOn(date).index;
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
  const { selectedDate, selectDate } = useKalendar();
  const number = date.getDate();

  const isDateSelected = DaysProvider.areDatesTheSame(
    selectedDate as Date,
    date
  );

  const style = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 42,
    height: 42,
    fontWeight: 500,
    padding: 0,
    ...(isDateSelected
      ? { backgroundColor: "black", color: "white" }
      : isTodaysDate
      ? { backgroundColor: "#f2f2f2" }
      : { backgroundColor: "transparent" }),
  };

  const dateLabel: string = date.toLocaleDateString("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <button
      onClick={() => selectDate(date)}
      aria-label={dateLabel}
      style={style}
    >
      {number}
    </button>
  );
};

const Actions = () => {
  const { previousMonth, nextMonth } = useKalendar();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <button onClick={previousMonth}>{"<"}</button>
      <Header />
      <button onClick={nextMonth}>{">"}</button>
    </div>
  );
};

const Header = () => {
  const { date } = useKalendar();

  const monthHeader = date.toLocaleString("en", { month: "long" });

  return (
    <span style={{ fontWeight: 500 }}>
      {monthHeader} {date.getUTCFullYear()}
    </span>
  );
};

export default App;
