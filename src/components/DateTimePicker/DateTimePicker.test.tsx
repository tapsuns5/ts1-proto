import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import DateTimePicker from "./DateTimePicker";
import * as utils from "./utils";

// Helper function to render the component with required props
const renderDateTimePicker = (props: any) =>
  render(<DateTimePicker {...props} />);

// Helper to open the popover
const openPopover = () => {
  fireEvent.click(screen.getByTestId("datetimepicker-calendar-icon"));
};

// Helper to get formatted date with ordinal
const getFormattedDateLabel = (date: Date) => {
  return `Choose ${formatDateWithOrdinal(date)}`;
};

// Mock the isMobile function to control desktop/mobile rendering
jest.mock("./utils", () => ({
  ...jest.requireActual("./utils"),
  isMobile: jest.fn(),
}));

const mockedIsMobile = utils.isMobile as jest.MockedFunction<
  typeof utils.isMobile
>;

function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return "th";
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

describe("DateTimePicker Component", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2020, 3, 1, 14, 30));
    mockedIsMobile.mockReturnValue(false); // Default to desktop
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  describe("Desktop Rendering", () => {
    it("renders with default props", () => {
      renderDateTimePicker({ name: "test-datetime" });
      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("placeholder", "MM/DD/YYYY HH:MM AM");
    });

    it("renders with default placeholder", () => {
      renderDateTimePicker({ name: "test-datetime" });
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("placeholder", "MM/DD/YYYY HH:MM AM");
    });

    it("renders with selected date and time", () => {
      const date = new Date(2023, 6, 5, 14, 30);
      renderDateTimePicker({ value: date, name: "test-datetime" });
      const input = screen.getByRole("textbox") as HTMLInputElement;
      expect(input.value).toBe("07/05/2023 02:30 PM");
    });

    it("opens calendar popover and displays time picker on click", () => {
      renderDateTimePicker({ name: "test-datetime" });
      openPopover();

      expect(screen.getByTestId("datetimepicker-popover-content")).toBeInTheDocument();
      expect(screen.getByLabelText("Select hour")).toBeInTheDocument();
      expect(screen.getByLabelText("Select minute")).toBeInTheDocument();
      expect(screen.getByLabelText("Select period")).toBeInTheDocument();
    });

    it("selects a date and updates the value", () => {
      const onChange = jest.fn();
      renderDateTimePicker({ onChange, name: "test-datetime", withFooter: false });
      openPopover();

      const today = new Date(2020, 3, 1);
      fireEvent.click(screen.getByLabelText(getFormattedDateLabel(today)));

      expect(onChange).toHaveBeenCalled();
      const calledDate = onChange.mock.calls[0][0];
      expect(calledDate).toBeInstanceOf(Date);
      expect(calledDate.getFullYear()).toBe(2020);
      expect(calledDate.getMonth()).toBe(3);
      expect(calledDate.getDate()).toBe(1);
    });

    describe("Footer functionality", () => {
      it("displays footer buttons when withFooter is true", () => {
        renderDateTimePicker({ withFooter: true, name: "test-datetime" });
        openPopover();

        expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Apply/i })).toBeInTheDocument();
      });

      it("cancel button closes popover without triggering onChange", () => {
        const onChange = jest.fn();
        renderDateTimePicker({ withFooter: true, onChange, name: "test-datetime" });
        openPopover();

        fireEvent.click(screen.getByRole("button", { name: /Cancel/i }));

        expect(onChange).not.toHaveBeenCalled();
        expect(screen.queryByTestId("datetimepicker-popover-content")).not.toBeInTheDocument();
      });

      it("apply button confirms selected date and triggers onChange", () => {
        const onChange = jest.fn();
        renderDateTimePicker({
          withFooter: true,
          onChange,
          value: new Date(2020, 3, 5, 10, 30),
          name: "test-datetime",
        });
        openPopover();

        fireEvent.click(screen.getByRole("button", { name: /Apply/i }));

        expect(onChange).toHaveBeenCalled();
      });
    });

    it("renders with error state", () => {
      const errors = ["Invalid date"];
      renderDateTimePicker({ errors, label: "Event Time" });
      expect(screen.getByText("Invalid date")).toBeInTheDocument();
    });

    it("renders disabled state", () => {
      renderDateTimePicker({ disabled: true, name: "test-datetime" });
      const input = screen.getByRole("textbox");
      expect(input).toBeDisabled();
    });

    it("renders different sizes", () => {
      const { container, rerender } = renderDateTimePicker({
        size: "small",
        name: "test-datetime",
      });
      let wrapper = container.querySelector('[class*="sui-h-"]');
      expect(wrapper).toHaveClass("sui-h-[32px]");

      rerender(<DateTimePicker size="large" name="test-datetime" />);
      wrapper = container.querySelector('[class*="sui-h-"]');
      expect(wrapper).toHaveClass("sui-h-[56px]");
    });
  });

  describe("Mobile Rendering", () => {
    beforeEach(() => {
      mockedIsMobile.mockReturnValue(true);
    });

    it("renders native input on mobile", () => {
      renderDateTimePicker({ name: "test-datetime" });
      const input = document.querySelector(
        'input[type="datetime-local"]',
      ) as HTMLInputElement;
      expect(input).toBeInTheDocument();
      expect(input.type).toBe("datetime-local");
    });

    it("updates value on native input change", () => {
      const onChange = jest.fn();
      renderDateTimePicker({ onChange, name: "test-datetime" });
      const input = document.querySelector(
        'input[type="datetime-local"]',
      ) as HTMLInputElement;

      fireEvent.change(input, { target: { value: "2023-07-05T14:30" } });

      expect(onChange).toHaveBeenCalled();
      const calledDate = onChange.mock.calls[0][0];
      expect(calledDate).toBeInstanceOf(Date);
    });
  });

  describe("Typing and Parsing", () => {
    beforeEach(() => {
      // Mock as desktop
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 1024,
      });
    });

    it("allows typing in the input field with automatic formatting", () => {
      renderDateTimePicker({ name: "test-datetime" });
      const input = screen.getByRole("textbox") as HTMLInputElement;

      //Type digits and expect automatic formatting
      fireEvent.change(input, { target: { value: "01152025" } });
      expect(input.value).toBe("01/15/2025");
    });

    it("parses and updates date when blurring with valid input - MM/DD/YYYY, HH:MM AM/PM", () => {
      const onChange = jest.fn();
      renderDateTimePicker({ onChange, name: "test-datetime" });
      const input = screen.getByRole("textbox");

      // Type digits: 01152025 1430 = 01/15/2025, 14:30 PM
      fireEvent.change(input, { target: { value: "01152025 1430" } });
      fireEvent.blur(input);

      expect(onChange).toHaveBeenCalled();
      const calledDate = onChange.mock.calls[0][0];
      expect(calledDate).toBeInstanceOf(Date);
      expect(calledDate.getFullYear()).toBe(2025);
      expect(calledDate.getMonth()).toBe(0); // January is 0
      expect(calledDate.getDate()).toBe(15);
      expect(calledDate.getHours()).toBe(14); // 2 PM
      expect(calledDate.getMinutes()).toBe(30);
    });

    it("parses date with 2-digit year - MM/DD/YY, HH:MM AM/PM", () => {
      const onChange = jest.fn();
      renderDateTimePicker({ onChange, name: "test-datetime" });
      const input = screen.getByRole("textbox");

      // Can manually type with slashes and it should still parse
      fireEvent.change(input, { target: { value: "01/15/25 02:30 PM" } });
      fireEvent.blur(input);

      expect(onChange).toHaveBeenCalled();
      const calledDate = onChange.mock.calls[0][0];
      expect(calledDate.getFullYear()).toBe(2025);
    });

    it("handles 12 AM correctly", () => {
      const onChange = jest.fn();
      renderDateTimePicker({ onChange, name: "test-datetime" });
      const input = screen.getByRole("textbox");

      // Type digits: 01152025 0030 = 01/15/2025, 00:30 AM (hour 00 < 12 so AM)
      fireEvent.change(input, { target: { value: "01152025 0030" } });
      fireEvent.blur(input);

      const calledDate = onChange.mock.calls[0][0];
      expect(calledDate.getHours()).toBe(0); // 12 AM = 0 in 24h
    });

    it("handles 12 PM correctly", () => {
      const onChange = jest.fn();
      renderDateTimePicker({ onChange, name: "test-datetime" });
      const input = screen.getByRole("textbox");

      // Type digits: 01152025 1230 = 01/15/2025, 12:30 PM (hour 12 >= 12 so PM)
      fireEvent.change(input, { target: { value: "01152025 1230" } });
      fireEvent.blur(input);

      const calledDate = onChange.mock.calls[0][0];
      expect(calledDate.getHours()).toBe(12); // 12 PM = 12 in 24h
    });

    it("reverts to last valid value on invalid input", () => {
      const date = new Date(2023, 6, 5, 14, 30);
      renderDateTimePicker({ value: date, name: "test-datetime" });
      const input = screen.getByRole("textbox") as HTMLInputElement;

      expect(input.value).toBe("07/05/2023 02:30 PM");

      fireEvent.change(input, { target: { value: "invalid date" } });
      fireEvent.blur(input);

      // Should revert to formatted date
      expect(input.value).toBe("07/05/2023 02:30 PM");
    });

    it("sets null value when empty string is provided", () => {
      const onChange = jest.fn();
      const date = new Date(2023, 6, 5, 14, 30);
      renderDateTimePicker({ value: date, onChange, name: "test-datetime" });
      const input = screen.getByRole("textbox");

      fireEvent.change(input, { target: { value: "" } });
      fireEvent.blur(input);

      expect(onChange).toHaveBeenCalledWith(null);
    });

    it("does not open popover when input is focused (allows typing)", () => {
      renderDateTimePicker({ name: "test-datetime" });
      const input = screen.getByRole("textbox");

      fireEvent.focus(input);

      // Popover should NOT open on focus - user should be able to type
      expect(
        screen.queryByTestId("datetimepicker-popover-content"),
      ).not.toBeInTheDocument();
    });

    it("allows manually changing PM to AM by editing the text", () => {
      const onChange = jest.fn();
      renderDateTimePicker({ onChange, name: "test-datetime" });
      const input = screen.getByRole("textbox");

      // Type a PM time (hour 14 = 2 PM)
      fireEvent.change(input, { target: { value: "011520251430" } });

      // Should show 2:30 PM
      expect((input as HTMLInputElement).value).toContain("PM");

      // Now manually change PM to AM
      fireEvent.change(input, { target: { value: "01/15/2025 02:30 AM" } });
      fireEvent.blur(input);

      expect(onChange).toHaveBeenCalled();
      const calledDate = onChange.mock.calls[0][0];
      expect(calledDate.getHours()).toBe(2); // Should be 2 AM (hour 2)
      expect(calledDate.getMinutes()).toBe(30);
    });
  });

  describe("Clear Button", () => {
    beforeEach(() => {
      // Mock as desktop
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 1024,
      });
    });

    it("shows clear button when allowClear is true and value exists", () => {
      const date = new Date(2023, 6, 5, 14, 30);
      renderDateTimePicker({
        value: date,
        allowClear: true,
        name: "test-datetime",
      });

      const clearIcon = screen.getByTestId("datetimepicker-clear-icon");
      expect(clearIcon).toBeInTheDocument();
    });

    it("does not show clear button when allowClear is false", () => {
      const date = new Date(2023, 6, 5, 14, 30);
      renderDateTimePicker({
        value: date,
        allowClear: false,
        name: "test-datetime",
      });

      const clearIcon = screen.queryByTestId("datetimepicker-clear-icon");
      expect(clearIcon).not.toBeInTheDocument();
    });

    it("does not show clear button when value is null", () => {
      renderDateTimePicker({
        value: null,
        allowClear: true,
        name: "test-datetime",
      });

      const clearIcon = screen.queryByTestId("datetimepicker-clear-icon");
      expect(clearIcon).not.toBeInTheDocument();
    });

    it("clears value when clear button is clicked", () => {
      const onChange = jest.fn();
      const date = new Date(2023, 6, 5, 14, 30);
      renderDateTimePicker({
        value: date,
        allowClear: true,
        onChange,
        name: "test-datetime",
      });

      const clearIcon = screen.getByTestId("datetimepicker-clear-icon");
      fireEvent.click(clearIcon);

      expect(onChange).toHaveBeenCalledWith(null);
    });

    it("does not open popover when clear button is clicked", () => {
      const date = new Date(2023, 6, 5, 14, 30);
      renderDateTimePicker({
        value: date,
        allowClear: true,
        name: "test-datetime",
      });

      const clearIcon = screen.getByTestId("datetimepicker-clear-icon");
      fireEvent.click(clearIcon);

      // Popover content should not be visible
      const popoverContent = screen.queryByTestId(
        "datetimepicker-popover-content",
      );
      expect(popoverContent).not.toBeInTheDocument();
    });
  });
});
