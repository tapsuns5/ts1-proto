import * as React from "react";
import DatePicker, { ReactDatePickerCustomHeaderProps } from "react-datepicker";
import { cn } from "../../utils";
import Icon from "../Icon/Icon";

type CalendarProps = {
  selected?: Date;
  minDate?: Date;
  maxDate?: Date;
  onChange?: (
    date: Date | null,
    event?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
  ) => void;
  renderDayContents?: (day: number, date: Date) => React.ReactNode;
  onMonthClick?: () => void;
  onYearClick?: () => void;
  openToDate?: Date;
  hideNavigation?: boolean;
  "data-testid"?: string;
};

const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  ({ onChange, renderDayContents, onMonthClick, onYearClick, openToDate, hideNavigation, ...props }, ref) => {
    const customHeader = (headerProps: ReactDatePickerCustomHeaderProps) => (
      <CustomDatePickerHeader
        {...headerProps}
        onMonthClick={onMonthClick}
        onYearClick={onYearClick}
        hideNavigation={hideNavigation}
      />
    );

    return (
      <div
        ref={ref}
        className="snap-ui-datepicker-wrapper"
        data-testid={props["data-testid"]}
      >
        <DatePicker
          renderCustomHeader={customHeader}
          inline
          disabledKeyboardNavigation
          renderDayContents={renderDayContents}
          onChange={onChange}
          openToDate={openToDate}
          {...props}
        />
      </div>
    );
  },
);

export default Calendar;

const CustomDatePickerHeader = ({
  date,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
  onMonthClick,
  onYearClick,
  hideNavigation,
}: ReactDatePickerCustomHeaderProps & {
  onMonthClick?: () => void;
  onYearClick?: () => void;
  hideNavigation?: boolean;
}) => (
  <div className={cn("sui-mb-1 sui-flex sui-items-center", hideNavigation ? "sui-justify-center" : "sui-justify-between")}>
    {!hideNavigation && (
      <button
        className={cn(
          prevMonthButtonDisabled
            ? "sui-invisible"
            : "sui-pt-1 hover:sui-text-action-background-hover",
        )}
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
        data-testid="snap-ui-datepicker-prev-month-button"
      >
        <Icon name="keyboard_arrow_left" />
      </button>
    )}
    <div className="react-datepicker__current-month sui-flex sui-items-center sui-gap-2">
      {onMonthClick ? (
        <button
          onClick={onMonthClick}
          className="hover:sui-underline"
          type="button"
        >
          {months[date.getMonth()]}
        </button>
      ) : (
        <span>{months[date.getMonth()]}</span>
      )}
      {onYearClick ? (
        <button
          onClick={onYearClick}
          className="hover:sui-underline"
          type="button"
        >
          {date.getFullYear()}
        </button>
      ) : (
        <span>{date.getFullYear()}</span>
      )}
    </div>
    {!hideNavigation && (
      <button
        className={cn(
          nextMonthButtonDisabled
            ? "sui-invisible"
            : "sui-pt-1 hover:sui-text-action-background-hover",
        )}
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
        data-testid="snap-ui-datepicker-next-month-button"
      >
        <Icon name="keyboard_arrow_right" />
      </button>
    )}
  </div>
);

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
