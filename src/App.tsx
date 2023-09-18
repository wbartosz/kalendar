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
      <Grid style={{ marginBottom: 8 }}>
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
        gap: 8,
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
      day={capitalize(abbreviation ? day.substring(0, 3) : day)}
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
  const blankStartingDays = DaysProvider.getDayMonthStartsOn(date).index;

  const dates = useMemo(() => DaysProvider.getDatesForMonth(date), [date]);
  const blanks = Array.from({ length: blankStartingDays }, () => "");

  return [
    ...blanks.map((_, i) => <span key={`blank_${i}`} />),
    ...dates.map((date) => <DayNumber date={date} key={date.toString()} />),
  ];
};

const DayNumber = ({ date }: { date: Date }) => {
  const { selectedDate, selectDate } = useKalendar();
  const number = date.getDate();

  const isDateSelected = DaysProvider.areDatesTheSame(
    selectedDate as Date,
    date
  );

  const style = {
    ...(isDateSelected
      ? { backgroundColor: "black", color: "white" }
      : { backgroundColor: "transparent" }),
  };

  return (
    <Cell>
      <button
        onClick={() => selectDate(date)}
        aria-label={date.toLocaleDateString()}
        style={style}
      >
        {number}
      </button>
    </Cell>
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
    <span>
      {monthHeader} {date.getUTCFullYear()}
    </span>
  );
};

export default App;
