import { useMemo, useState } from "react";
import "./App.css";
import { Day } from "./DayTypes";
import {
  add,
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

  return (
    <Kalendar
      value={date}
      onChange={setDate}
      size="small"
      showSuggestedActions
      displayedMonths={2}
    />
  );
}

export type Value = Date | null;

export type Size = "default" | "small";

type DisplayedMonths = 1 | 2;

export type KalendarProps = {
  value: Date | null;
  onChange: React.Dispatch<React.SetStateAction<Value>>;
  date?: Date;
  size?: Size;
  locale?: Intl.LocalesArgument;
  showSuggestedActions?: boolean;
  displayedMonths?: DisplayedMonths;
};

const Kalendar = (props: KalendarProps) => {
  const { displayedMonths = 1, showSuggestedActions = false } = props;

  return (
    <KalendarProvider {...props}>
      {showSuggestedActions ? <SuggestedActions /> : null}

      <MonthView displayedMonths={displayedMonths} />
    </KalendarProvider>
  );
};

const MonthView = ({
  displayedMonths,
}: {
  displayedMonths: DisplayedMonths;
}) => {
  const { date } = useKalendar();
  const showAllNavigationButtons = displayedMonths === 1;

  return (
    <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
      <MonthGrid
        date={date}
        showPreviousMonth
        showNextMonth={showAllNavigationButtons}
      />
      {displayedMonths === 2 && (
        <MonthGrid
          date={add(date, 1, "month")}
          showPreviousMonth={showAllNavigationButtons}
          showNextMonth
        />
      )}
    </div>
  );
};

const WeekDays = () => {
  const { locale } = useKalendar();

  const weekDays = useMemo(() => getWeekDays(locale), [locale]);

  return weekDays.map((day) => (
    <DayLabel day={day.substring(0, 2)} key={day} />
  ));
};

const DayLabel = ({ day }: { day: Day | string }) => {
  return <div>{day}</div>;
};

const MonthGrid = ({
  date,
  showPreviousMonth,
  showNextMonth,
}: {
  date: Date;
  showPreviousMonth: boolean;
  showNextMonth: boolean;
}) => {
  const { size } = useKalendar();

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

  const smallClassName = size === "small" ? "grid__week--small" : "";

  return (
    <div style={{ flexShrink: 0 }}>
      <Actions
        date={date}
        showPreviousMonth={showPreviousMonth}
        showNextMonth={showNextMonth}
      />

      <div className={`grid grid__week ${smallClassName}`}>
        <WeekDays />
      </div>
      <div className="grid">
        {[
          ...getBlankDays(date),
          ...dates.map((date, i) => (
            <DayNumber
              date={date}
              isTodaysDate={todaysDateIndex === i}
              key={date.toString()}
            />
          )),
        ]}
      </div>
    </div>
  );
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

const Actions = ({
  date,
  showPreviousMonth,
  showNextMonth,
}: {
  date: Date;
  showPreviousMonth: boolean;
  showNextMonth: boolean;
}) => {
  const { previousMonth, nextMonth, size } = useKalendar();

  const getVisibility = (show: boolean) => (show ? "visible" : "hidden");

  return (
    <div
      className="actions"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Button
        onClick={previousMonth}
        aria-label="previous month"
        size={size}
        style={{ visibility: getVisibility(showPreviousMonth) }}
      >
        {"←"}
      </Button>
      <MonthHeaderButton date={date} />
      <Button
        onClick={nextMonth}
        aria-label="next month"
        size={size}
        style={{ visibility: getVisibility(showNextMonth) }}
      >
        {"→"}
      </Button>
    </div>
  );
};

const SuggestedActions = () => {
  const { selectDate, size } = useKalendar();
  const today = getTodaysDate();

  const selectToday = () => selectDate(today);
  const selectTomorrow = () => selectDate(add(today, 1, "day"));
  const in2days = () => selectDate(add(today, 2, "days"));

  const props = { size };

  return (
    <div
      className="suggested-actions"
      style={{ display: "flex", gap: 8, marginBottom: 12 }}
    >
      <Button {...props} onClick={selectToday}>
        Today
      </Button>
      <Button {...props} onClick={selectTomorrow}>
        Tomorrow
      </Button>
      <Button {...props} onClick={in2days}>
        In 2 days
      </Button>
    </div>
  );
};

const MonthHeaderButton = ({ date }: { date: Date }) => {
  const { size, locale } = useKalendar();

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
