import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { DatePicker } from "../../index";
import type { DateRangePreset } from "./DatePicker.types";

const meta: Meta<typeof DatePicker> = {
  component: DatePicker,
  title: "Components/DatePicker",
  parameters: {
    layout: "centered",
    componentSubtitle: (
      <div>
        <p className="sui-mb-1">
          A DatePicker that supports range and shortcuts.
        </p>
      </div>
    ),
    design: {
      type: "figma",
      url: "https://www.figma.com/design/B9YbaCM1s3RdIe9kLCLRcu/%F0%9F%92%BB-Web-App-%E2%80%94-Base-Components?node-id=1047-43126&m=dev",
    },
  },
  argTypes: {
    range: { control: "boolean" },
    showApplyButton: { control: "boolean" },
    clearable: { control: "boolean" },
    fixedDatesShortcut: { control: "boolean" },
    fixedDatesList: { control: "object" },
    calendarProps: {
      control: undefined,
      description:
        "Check the props available for the calendar component in the Calendar component. When `range` is **true** send props as `[calendarProps, calendarProps]` second (End Date) calendar props are optional.",
    },
    onChange: { action: "changed" },
    value: { control: "object" },
  },
  decorators: [
    (Story) => (
      <div className="sui-flex sui-min-h-[620px] sui-items-start sui-justify-center">
        <Story />
      </div>
    ),
  ],
  args: {
    onChange: fn(),
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  // @ts-expect-error fix this in the future
  args: {
    onChange: fn(),
  },
  render: function Render(args) {
    const [date, setDate] = useState<Date | null>(new Date());
    return (
      <DatePicker
        value={date}
        onChange={(newDate: Date | null) => {
          setDate(newDate);
          // @ts-expect-error fix this in the future
          args.onChange?.(newDate);
        }}
      />
    );
  },
};

export const Range: Story = {
  // @ts-expect-error fix this in the future
  args: {
    range: true,
  },
  render: function Render(args) {
    const [rangeDate, setRangeDate] = useState<[Date, Date] | null | undefined>(
      [
        new Date(),
        new Date(
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          new Date().getDate(),
        ),
      ],
    );
    return (
      <DatePicker
        // @ts-expect-error fix this in the future
        {...args}
        value={rangeDate}
        onChange={(newRange: [Date, Date] | null | undefined) => {
          setRangeDate(newRange);
          // @ts-expect-error fix this in the future
          args.onChange?.(newRange);
        }}
      />
    );
  },
};

export const WithFooter: Story = {
  // @ts-expect-error fix this in the future
  args: {
    range: true,
    showApplyButton: true,
  },
  render: function Render(args) {
    const [rangeDate, setRangeDate] = useState<
      [Date, Date] | null | undefined
    >();
    return (
      <DatePicker
        // @ts-expect-error fix this in the future
        {...args}
        value={rangeDate}
        onChange={(newRange: [Date, Date] | null | undefined) => {
          setRangeDate(newRange);
          // @ts-expect-error fix this in the future
          args.onChange?.(newRange);
        }}
      />
    );
  },
};

export const RangeWithFixedDates: Story = {
  // @ts-expect-error fix this in the future
  args: {
    // @ts-expect-error fix this in the future
    ...Range.args,
    fixedDatesShortcut: true,
  },
  render: Range.render,
};

const fixedDatesList: DateRangePreset[] = [
  {
    label: "This month",
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
  },
  {
    label: "Today + 3 months",
    startDate: new Date(),
    endDate: new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 3,
      new Date().getDate(),
    ),
  },
  {
    label: "Today + 6 months",
    startDate: new Date(),
    endDate: new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 6,
      new Date().getDate(),
    ),
  },
  {
    label: "Today + 9 months",
    startDate: new Date(),
    endDate: new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 9,
      new Date().getDate(),
    ),
  },
  {
    label: "This year",
    startDate: new Date(new Date().getFullYear(), 0, 1),
    endDate: new Date(new Date().getFullYear(), 11, 31),
  },
];

export const RangeWithCustomFixedDates: Story = {
  // @ts-expect-error fix this in the future
  args: {
    // @ts-expect-error fix this in the future
    ...RangeWithFixedDates.args,
    // @ts-expect-error fix this in the future
    ...WithFooter.args,
    fixedDatesList: fixedDatesList,
  },
  render: Range.render,
};

function ClearableRender() {
  const [rangeDate, setRangeDate] = useState<
    [Date | undefined, Date | undefined] | null
  >([
    new Date(),
    new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      new Date().getDate(),
    ),
  ]);
  return (
    <DatePicker
      range
      clearable
      value={rangeDate}
      onChange={(newRange) => setRangeDate(newRange ?? null)}
    />
  );
}

export const Clearable = {
  render: ClearableRender,
};

export const Disabled = {
  render: function Render() {
    const [date, setDate] = useState<Date | null>(new Date());
    const handleChange = (newDate: Date | null) => {
      setDate(newDate);
    };
    return (
      <DatePicker
        disabled
        value={date}
        onChange={handleChange}
      />
    );
  },
};
