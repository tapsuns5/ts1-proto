import "@testing-library/jest-dom";
import { fireEvent, render, screen, within } from "@testing-library/react";
import DatePicker from "../DatePicker/DatePicker";

// Mock useTwBreakpoint to always return desktop layout (isMd: true)
jest.mock("../../hooks/useTwBreakpoint", () => ({
  useTwBreakpoint: () => ({ isMd: true }),
}));

// Helper function to render the component with required props
const renderDatePicker = (props: any) => render(<DatePicker {...props} />);

function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return "th"; // covers 11th to 20th
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

function formatDateWithOrdinal(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = date.toLocaleDateString("en-US", options);
  const day = date.getDate();
  const ordinalSuffix = getOrdinalSuffix(day);
  return formattedDate.replace(day.toString(), `${day}${ordinalSuffix}`);
}

describe("DatePicker Component", () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2020, 3, 1));
  });

  afterAll(() => {
    // Restore the original Date implementation
    jest.restoreAllMocks();
  });
  it("renders with default props", () => {
    renderDatePicker({});
    expect(screen.getByText("Select a date range")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("renders with provided placeholder", () => {
    const placeholder = "Pick a date";
    renderDatePicker({ placeholder });
    expect(screen.getByText(placeholder)).toBeInTheDocument();
  });

  it("renders with selected date", () => {
    const date = new Date(2023, 6, 5);
    renderDatePicker({ value: date });
    expect(screen.getByText("07/05/2023")).toBeInTheDocument();
  });

  it("opens calendar popover on click", () => {
    renderDatePicker({});
    fireEvent.click(screen.getByRole("button"));
    expect(
      screen.getByTestId("snap-ui-calendar-popover-content"),
    ).toBeInTheDocument();
  });

  it("selects a date and updates the value", () => {
    const onChange = jest.fn();
    renderDatePicker({ onChange });
    fireEvent.click(screen.getByRole("button"));
    const today = new Date();
    const labelText = `Choose ${formatDateWithOrdinal(today)}`;
    const { year, month, day } = {
      year: today.getFullYear(),
      month: today.getMonth(),
      day: today.getDate(),
    };
    fireEvent.click(screen.getByLabelText(labelText));
    expect(onChange).toHaveBeenCalledWith(new Date(year, month, day));
  });

  it("selects a date range and updates the value", () => {
    const onChange = jest.fn();
    renderDatePicker({ range: true, onChange });

    fireEvent.click(screen.getByRole("button"));

    const start = new Date(2020, 3, 5); // Apr 5, 2020
    const end = new Date(2020, 3, 10); // Apr 10, 2020

    // With consecutive months, both dates are in April (left calendar)
    const startCalendar = screen.getByTestId("snap-ui-calendar-range-start");

    fireEvent.click(
      within(startCalendar).getByLabelText(
        `Choose ${formatDateWithOrdinal(start)}`,
      ),
    );
    fireEvent.click(
      within(startCalendar).getByLabelText(
        `Choose ${formatDateWithOrdinal(end)}`,
      ),
    );

    expect(onChange).toHaveBeenCalledWith([start, end]);
  });

  it("displays selected range string in input", () => {
    const from = new Date(2020, 3, 5);
    const to = new Date(2020, 3, 10);

    renderDatePicker({ range: true, value: [from, to] });

    expect(screen.getByText("04/05/2020")).toBeInTheDocument();
    expect(screen.getByText("04/10/2020")).toBeInTheDocument();
  });

  it("clicking a preset applies the corresponding date range", () => {
    const onChange = jest.fn();
    const today = new Date(2020, 3, 1);
    const yesterday = new Date(2020, 2, 31);

    renderDatePicker({
      range: true,
      fixedDatesShortcut: true,
      fixedDatesList: [
        {
          label: "Yesterday",
          startDate: yesterday,
          endDate: today,
        },
      ],
      onChange,
    });

    fireEvent.click(screen.getByRole("button"));

    const preset = screen.getByRole("button", { name: /Yesterday/i });

    fireEvent.click(preset);

    expect(onChange).toHaveBeenCalledWith([yesterday, today]);
  });

  it("cancel button closes popover without triggering onChange", () => {
    const onChange = jest.fn();
    renderDatePicker({ showApplyButton: true, onChange });

    fireEvent.click(screen.getByRole("button"));

    const cancelButton = screen.getByRole("button", { name: /Cancel/i });
    fireEvent.click(cancelButton);

    expect(onChange).not.toHaveBeenCalled();
    expect(
      screen.queryByTestId("snap-ui-calendar-popover-content"),
    ).not.toBeInTheDocument();
  });

  it("apply button confirms selected range and triggers onChange", () => {
    const onChange = jest.fn();
    renderDatePicker({ showApplyButton: true, onChange, range: true });

    fireEvent.click(screen.getByRole("button"));

    const start = new Date(2020, 3, 5);
    const end = new Date(2020, 3, 10);

    // With consecutive months, both dates are in April (left calendar)
    const startCalendar = screen.getByTestId("snap-ui-calendar-range-start");

    fireEvent.click(
      within(startCalendar).getByLabelText(
        `Choose ${formatDateWithOrdinal(start)}`,
      ),
    );
    fireEvent.click(
      within(startCalendar).getByLabelText(
        `Choose ${formatDateWithOrdinal(end)}`,
      ),
    );
    const applyButton = screen.getByRole("button", { name: /Apply/i });
    fireEvent.click(applyButton);

    expect(onChange).toHaveBeenCalledWith([start, end]);
  });

  it("renders unified navigation buttons for range picker", () => {
    renderDatePicker({ range: true });
    fireEvent.click(screen.getByRole("button"));

    expect(
      screen.getByTestId("snap-ui-daterangepicker-prev-month-button"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("snap-ui-daterangepicker-next-month-button"),
    ).toBeInTheDocument();
  });

  it("shows consecutive months in range picker", () => {
    renderDatePicker({ range: true });
    fireEvent.click(screen.getByRole("button"));

    // Left calendar shows April 2020, right calendar shows May 2020
    expect(screen.getByText(/April\b/i)).toBeInTheDocument();
    expect(screen.getByText(/May\b/i)).toBeInTheDocument();
  });

  it("navigates both calendars together with prev button", () => {
    renderDatePicker({ range: true });
    fireEvent.click(screen.getByRole("button"));

    // Initially April and May
    expect(screen.getByText(/April\b/i)).toBeInTheDocument();
    expect(screen.getByText(/May\b/i)).toBeInTheDocument();

    // Click prev button (moves 2 months at a time)
    fireEvent.click(
      screen.getByTestId("snap-ui-daterangepicker-prev-month-button"),
    );

    // Now February and March
    expect(screen.getByText(/February\b/i)).toBeInTheDocument();
    expect(screen.getByText(/March\b/i)).toBeInTheDocument();
  });

  it("navigates both calendars together with next button", () => {
    renderDatePicker({ range: true });
    fireEvent.click(screen.getByRole("button"));

    // Initially April and May
    expect(screen.getByText(/April\b/i)).toBeInTheDocument();
    expect(screen.getByText(/May\b/i)).toBeInTheDocument();

    // Click next button (moves 2 months at a time)
    fireEvent.click(
      screen.getByTestId("snap-ui-daterangepicker-next-month-button"),
    );

    // Now June and July
    expect(screen.getByText(/June\b/i)).toBeInTheDocument();
    expect(screen.getByText(/July\b/i)).toBeInTheDocument();
  });

  describe("Clearable DatePicker", () => {
    it("does not show clear button when clearable is false", () => {
      const date = new Date(2023, 6, 5);
      renderDatePicker({ value: date, clearable: false });
      expect(
        screen.queryByTestId("datepicker-clear-button"),
      ).not.toBeInTheDocument();
    });

    it("does not show clear button when clearable is true but no value", () => {
      renderDatePicker({ clearable: true });
      expect(
        screen.queryByTestId("datepicker-clear-button"),
      ).not.toBeInTheDocument();
    });

    it("shows clear button when clearable is true and value exists", () => {
      const date = new Date(2023, 6, 5);
      renderDatePicker({ value: date, clearable: true });
      expect(screen.getByTestId("datepicker-clear-button")).toBeInTheDocument();
    });

    it("clears single date value when clear button is clicked", () => {
      const onChange = jest.fn();
      const date = new Date(2023, 6, 5);
      renderDatePicker({ value: date, clearable: true, onChange });

      fireEvent.click(screen.getByTestId("datepicker-clear-button"));
      expect(onChange).toHaveBeenCalledWith(null);
    });

    it("clears range value when clear button is clicked", () => {
      const onChange = jest.fn();
      const from = new Date(2020, 3, 5);
      const to = new Date(2020, 3, 10);
      renderDatePicker({
        range: true,
        value: [from, to],
        clearable: true,
        onChange,
      });

      fireEvent.click(screen.getByTestId("datepicker-clear-button"));
      expect(onChange).toHaveBeenCalledWith([undefined, undefined]);
    });

    it("does not open popover when clear button is clicked", () => {
      const date = new Date(2023, 6, 5);
      renderDatePicker({ value: date, clearable: true });

      fireEvent.click(screen.getByTestId("datepicker-clear-button"));
      expect(
        screen.queryByTestId("snap-ui-calendar-popover-content"),
      ).not.toBeInTheDocument();
    });

    it("supports Enter key for clear button", () => {
      const onChange = jest.fn();
      const date = new Date(2023, 6, 5);
      renderDatePicker({ value: date, clearable: true, onChange });

      const clearButton = screen.getByTestId("datepicker-clear-button");
      fireEvent.keyDown(clearButton, { key: "Enter" });
      expect(onChange).toHaveBeenCalledWith(null);
    });

    it("supports Space key for clear button", () => {
      const onChange = jest.fn();
      const date = new Date(2023, 6, 5);
      renderDatePicker({ value: date, clearable: true, onChange });

      const clearButton = screen.getByTestId("datepicker-clear-button");
      fireEvent.keyDown(clearButton, { key: " " });
      expect(onChange).toHaveBeenCalledWith(null);
    });

    it("clear button has correct aria-label", () => {
      const date = new Date(2023, 6, 5);
      renderDatePicker({ value: date, clearable: true });

      const clearButton = screen.getByTestId("datepicker-clear-button");
      expect(clearButton).toHaveAttribute("aria-label", "Clear date selection");
    });
  });
});
