import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { DateTimePicker } from "../../index";

const meta: Meta<typeof DateTimePicker> = {
  component: DateTimePicker,
  title: "Components/DateTimePicker",
  parameters: {
    layout: "centered",
    componentSubtitle: (
      <div>
        <p className="sui-mb-1">
          A DateTimePicker that allows users to select both date and time.
          Users can type dates directly (e.g., "1/15/2025 2:30 PM") or use the calendar picker.
          Supports month/year dropdowns for easier navigation to distant dates.
          Uses native picker on mobile devices and a custom picker on desktop.
        </p>
      </div>
    ),
    design: {
      type: "figma",
      url: "place_with_real_figma_link",
    },
  },
  argTypes: {
    size: {
      control: "select",
      options: ["small", "default", "large"],
    },
    withFooter: { control: "boolean" },
    disabled: { control: "boolean" },
    onChange: { action: "changed" },
    value: { control: "object" },
  },
  decorators: [
    (Story) => (
      <div className="sui-flex sui-min-h-[620px] sui-items-start sui-justify-center sui-py-[15rem]">
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
  args: {
    onChange: fn(),
    name: "default-datetime",
  },
  render: function Render(args) {
    const [date, setDate] = useState<Date | null>(new Date());
    return (
      <DateTimePicker
        {...args}
        value={date}
        onChange={(newDate: Date | null) => {
          setDate(newDate);
          args.onChange?.(newDate);
        }}
      />
    );
  },
};

export const WithLabel: Story = {
  args: {
    label: "Event Date & Time",
    name: "labeled-datetime",
    onChange: fn(),
  },
  render: function Render(args) {
    const [date, setDate] = useState<Date | null>(null);
    return (
      <DateTimePicker
        {...args}
        value={date}
        onChange={(newDate: Date | null) => {
          setDate(newDate);
          args.onChange?.(newDate);
        }}
      />
    );
  },
};

export const WithFooter: Story = {
  args: {
    withFooter: true,
    label: "Appointment Time",
    name: "with-footer-datetime",
    onChange: fn(),
  },
  render: function Render(args) {
    const [date, setDate] = useState<Date | null>(null);
    return (
      <DateTimePicker
        {...args}
        value={date}
        onChange={(newDate: Date | null) => {
          setDate(newDate);
          args.onChange?.(newDate);
        }}
      />
    );
  },
};

export const SmallSize: Story = {
  args: {
    size: "small",
    label: "Meeting Time",
    name: "small-datetime",
    onChange: fn(),
  },
  render: function Render(args) {
    const [date, setDate] = useState<Date | null>(new Date());
    return (
      <DateTimePicker
        {...args}
        value={date}
        onChange={(newDate: Date | null) => {
          setDate(newDate);
          args.onChange?.(newDate);
        }}
      />
    );
  },
};

export const LargeSize: Story = {
  args: {
    size: "large",
    label: "Event Start",
    name: "large-datetime",
    onChange: fn(),
  },
  render: function Render(args) {
    const [date, setDate] = useState<Date | null>(new Date());
    return (
      <DateTimePicker
        {...args}
        value={date}
        onChange={(newDate: Date | null) => {
          setDate(newDate);
          args.onChange?.(newDate);
        }}
      />
    );
  },
};

export const WithError: Story = {
  args: {
    label: "Deadline",
    name: "error-datetime",
    errors: ["Please select a valid date and time"],
    onChange: fn(),
  },
  render: function Render(args) {
    const [date, setDate] = useState<Date | null>(null);
    return (
      <DateTimePicker
        {...args}
        value={date}
        onChange={(newDate: Date | null) => {
          setDate(newDate);
          args.onChange?.(newDate);
        }}
      />
    );
  },
};

export const Required: Story = {
  args: {
    label: "Scheduled Time",
    name: "required-datetime",
    required: true,
    onChange: fn(),
  },
  render: function Render(args) {
    const [date, setDate] = useState<Date | null>(null);
    return (
      <DateTimePicker
        {...args}
        value={date}
        onChange={(newDate: Date | null) => {
          setDate(newDate);
          args.onChange?.(newDate);
        }}
      />
    );
  },
};

export const Disabled: Story = {
  args: {
    label: "Event Time",
    name: "disabled-datetime",
    disabled: true,
    onChange: fn(),
  },
  render: function Render(args) {
    const [date, setDate] = useState<Date | null>(new Date());
    return (
      <DateTimePicker
        {...args}
        value={date}
        onChange={(newDate: Date | null) => {
          setDate(newDate);
          args.onChange?.(newDate);
        }}
      />
    );
  },
};

export const PrePopulated: Story = {
  args: {
    label: "Event Date & Time",
    name: "prepopulated-datetime",
    onChange: fn(),
  },
  render: function Render(args) {
    // Initialize with a specific date (e.g., from database or API)
    const [date, setDate] = useState<Date | null>(
      new Date(2025, 11, 25, 14, 30), // Dec 25, 2025 at 2:30 PM
    );
    return (
      <DateTimePicker
        {...args}
        value={date}
        onChange={(newDate: Date | null) => {
          setDate(newDate);
          args.onChange?.(newDate);
        }}
      />
    );
  },
};

export const NoPastDates: Story = {
  args: {
    label: "Appointment Date & Time",
    name: "no-past-dates-datetime",
    onChange: fn(),
  },
  render: function Render(args) {
    const [date, setDate] = useState<Date | null>(null);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today

    return (
      <DateTimePicker
        {...args}
        value={date}
        onChange={(newDate: Date | null) => {
          setDate(newDate);
          args.onChange?.(newDate);
        }}
        calendarProps={{
          minDate: today, // Prevent selecting any date before today
        }}
      />
    );
  },
};

export const WithDefaultDate: Story = {
  args: {
    label: "Event Date & Time",
    name: "default-date-datetime",
    onChange: fn(),
  },
  render: function Render(args) {
    const [date, setDate] = useState<Date | null>(null);
    const defaultDate = new Date();
    defaultDate.setHours(0, 0, 0, 0);

    return (
      <DateTimePicker
        {...args}
        value={date}
        onChange={(newDate: Date | null) => {
          setDate(newDate);
          args.onChange?.(newDate);
        }}
        defaultDate={defaultDate}
        withFooter={true}
      />
    );
  },
};

export const WithClearButton: Story = {
  args: {
    label: "Appointment Date & Time",
    name: "clear-datetime",
    onChange: fn(),
    allowClear: true,
  },
  render: function Render(args) {
    const [date, setDate] = useState<Date | null>(new Date());
    return (
      <DateTimePicker
        {...args}
        value={date}
        onChange={(newDate: Date | null) => {
          setDate(newDate);
          args.onChange?.(newDate);
        }}
      />
    );
  },
};

export const WithMonthYearDropdowns: Story = {
  args: {
    label: "Event Date & Time",
    name: "month-year-dropdown-datetime",
    onChange: fn(),
  },
  render: function Render(args) {
    const [date, setDate] = useState<Date | null>(null);
    return (
      <DateTimePicker
        {...args}
        value={date}
        onChange={(newDate: Date | null) => {
          setDate(newDate);
          args.onChange?.(newDate);
        }}
        calendarProps={{
          showMonthDropdown: true,
          showYearDropdown: true,
          dropdownMode: "select",
        }}
      />
    );
  },
};

export const WithScrollableYearDropdown: Story = {
  args: {
    label: "Birth Date & Time",
    name: "scrollable-year-datetime",
    onChange: fn(),
  },
  render: function Render(args) {
    const [date, setDate] = useState<Date | null>(null);
    return (
      <DateTimePicker
        {...args}
        value={date}
        onChange={(newDate: Date | null) => {
          setDate(newDate);
          args.onChange?.(newDate);
        }}
        calendarProps={{
          showMonthDropdown: true,
          showYearDropdown: true,
          scrollableYearDropdown: true,
          yearDropdownItemNumber: 100,
          dropdownMode: "select",
        }}
      />
    );
  },
};

export const TypingExample: Story = {
  args: {
    label: "Type or Pick Date & Time",
    name: "typing-example-datetime",
    onChange: fn(),
  },
  render: function Render(args) {
    const [date, setDate] = useState<Date | null>(null);
    return (
        <DateTimePicker
          {...args}
          value={date}
          onChange={(newDate: Date | null) => {
            setDate(newDate);
            args.onChange?.(newDate);
          }}
          allowClear={true}
        />
    );
  },
};

export const FullFeatured: Story = {
  args: {
    label: "Appointment Date & Time",
    name: "full-featured-datetime",
    onChange: fn(),
    helpText: "Type a date or use the picker with month/year dropdowns",
  },
  render: function Render(args) {
    const [date, setDate] = useState<Date | null>(null);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
      <DateTimePicker
        {...args}
        value={date}
        onChange={(newDate: Date | null) => {
          setDate(newDate);
          args.onChange?.(newDate);
        }}
        allowClear={true}
        withFooter={true}
        calendarProps={{
          showMonthDropdown: true,
          showYearDropdown: true,
          dropdownMode: "select",
          minDate: today,
        }}
      />
    );
  },
};

export const Guide: Story = {
  parameters: {
    layout: "fullscreen",
    docs: {
      disable: true,
    },
  },
  render: () => (
    <div className="sui-max-w-4xl sui-mx-auto sui-p-8 sui-prose sui-prose-sm">
      <div className="sui-mb-8">
        <h1 className="sui-text-3xl sui-font-bold sui-mb-4">DateTimePicker Guide</h1>
        <p className="sui-text-lg sui-text-gray-600 sui-mb-6">
          A flexible date and time picker component that supports both typed input and calendar selection, 
          with smart auto-formatting and enhanced UX features.
        </p>
      </div>

      <div className="sui-space-y-8">
        <section>
          <h2 className="sui-text-2xl sui-font-semibold sui-mb-4">🎯 Smart Auto-Formatting</h2>
          <p className="sui-mb-4">Type dates naturally - the component automatically formats as you type:</p>
          <div className="sui-bg-gray-50 sui-p-4 sui-rounded-lg sui-font-mono sui-text-sm">
            <div>12252024 → 12/25/2024</div>
            <div>1225202414 → 12/25/2024 02</div>
            <div>122520241430 → 12/25/2024 02:30</div>
          </div>
        </section>

        <section>
          <h2 className="sui-text-2xl sui-font-semibold sui-mb-4">📝 Key Features</h2>
          <ul className="sui-list-disc sui-list-inside sui-space-y-2">
            <li><strong>Typed input:</strong> Direct text entry with smart formatting</li>
            <li><strong>Calendar picker:</strong> Visual date selection with time picker</li>
            <li><strong>Mobile optimized:</strong> Native picker on mobile devices</li>
            <li><strong>Enhanced UX:</strong> Preserves user intent during manual editing</li>
            <li><strong>Accessibility:</strong> Full keyboard navigation and screen reader support</li>
          </ul>
        </section>

        <section>
          <h2 className="sui-text-2xl sui-font-semibold sui-mb-4">🔧 React Hook Form Integration</h2>
          <div className="sui-bg-gray-50 sui-p-4 sui-rounded-lg">
            <pre className="sui-text-sm sui-overflow-x-auto">
{`import { Controller, useForm } from 'react-hook-form';

<Controller
  name="eventDate"
  control={control}
  rules={{
    required: "Event date is required",
    validate: (value) => {
      if (!value) return "Please select a date";
      if (value < new Date()) return "Date must be in the future";
      return true;
    }
  }}
  render={({ field, fieldState }) => (
    <DateTimePicker
      value={field.value}
      onChange={field.onChange}
      label="Event Date & Time"
      required
      errors={fieldState.error ? [fieldState.error.message] : undefined}
    />
  )}
/>`}
            </pre>
          </div>
        </section>

        <section>
          <h2 className="sui-text-2xl sui-font-semibold sui-mb-4">📋 Common Props</h2>
          <div className="sui-overflow-x-auto">
            <table className="sui-min-w-full sui-border sui-border-gray-200">
              <thead className="sui-bg-gray-50">
                <tr>
                  <th className="sui-px-4 sui-py-2 sui-text-left sui-font-semibold">Prop</th>
                  <th className="sui-px-4 sui-py-2 sui-text-left sui-font-semibold">Type</th>
                  <th className="sui-px-4 sui-py-2 sui-text-left sui-font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="sui-divide-y sui-divide-gray-200">
                <tr>
                  <td className="sui-px-4 sui-py-2 sui-font-mono sui-text-sm">value</td>
                  <td className="sui-px-4 sui-py-2 sui-font-mono sui-text-sm">Date | null</td>
                  <td className="sui-px-4 sui-py-2">Current selected date/time</td>
                </tr>
                <tr>
                  <td className="sui-px-4 sui-py-2 sui-font-mono sui-text-sm">onChange</td>
                  <td className="sui-px-4 sui-py-2 sui-font-mono sui-text-sm">{'(date: Date | null) => void'}</td>
                  <td className="sui-px-4 sui-py-2">Callback when date changes</td>
                </tr>
                <tr>
                  <td className="sui-px-4 sui-py-2 sui-font-mono sui-text-sm">label</td>
                  <td className="sui-px-4 sui-py-2 sui-font-mono sui-text-sm">string</td>
                  <td className="sui-px-4 sui-py-2">Input label text</td>
                </tr>
                <tr>
                  <td className="sui-px-4 sui-py-2 sui-font-mono sui-text-sm">allowClear</td>
                  <td className="sui-px-4 sui-py-2 sui-font-mono sui-text-sm">boolean</td>
                  <td className="sui-px-4 sui-py-2">Show clear button when value exists</td>
                </tr>
                <tr>
                  <td className="sui-px-4 sui-py-2 sui-font-mono sui-text-sm">withFooter</td>
                  <td className="sui-px-4 sui-py-2 sui-font-mono sui-text-sm">boolean</td>
                  <td className="sui-px-4 sui-py-2">Show Apply/Cancel buttons</td>
                </tr>
                <tr>
                  <td className="sui-px-4 sui-py-2 sui-font-mono sui-text-sm">calendarProps</td>
                  <td className="sui-px-4 sui-py-2 sui-font-mono sui-text-sm">CalendarProps</td>
                  <td className="sui-px-4 sui-py-2">Props passed to Calendar component (minDate, maxDate, etc.)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="sui-text-2xl sui-font-semibold sui-mb-4">💡 Tips & Best Practices</h2>
          <div className="sui-space-y-4">
            <div>
              <h3 className="sui-font-semibold sui-mb-2">Smart Typing Features</h3>
              <ul className="sui-list-disc sui-list-inside sui-space-y-1 sui-text-sm">
                <li>Type <code className="sui-bg-gray-100 sui-px-1 sui-rounded">12252024</code> for quick date entry</li>
                <li>Edit formatted dates normally - the component won't interfere</li>
                <li>Accepts multiple formats: MM/DD/YYYY, MM/DD/YY, and more</li>
                <li>Automatically converts 24-hour to 12-hour format</li>
              </ul>
            </div>
            <div>
              <h3 className="sui-font-semibold sui-mb-2">Accessibility</h3>
              <ul className="sui-list-disc sui-list-inside sui-space-y-1 sui-text-sm">
                <li>Always provide a descriptive <code className="sui-bg-gray-100 sui-px-1 sui-rounded">label</code></li>
                <li>Use <code className="sui-bg-gray-100 sui-px-1 sui-rounded">helpText</code> for additional context</li>
                <li>Component includes proper ARIA labels automatically</li>
                <li>Full keyboard navigation support</li>
              </ul>
            </div>
            <div>
              <h3 className="sui-font-semibold sui-mb-2">Form Integration</h3>
              <ul className="sui-list-disc sui-list-inside sui-space-y-1 sui-text-sm">
                <li>Works seamlessly with react-hook-form, Formik, and other form libraries</li>
                <li>Use <code className="sui-bg-gray-100 sui-px-1 sui-rounded">Controller</code> component for react-hook-form integration</li>
                <li>Handle validation at the form level for better UX</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="sui-text-2xl sui-font-semibold sui-mb-4">📖 Complete Documentation</h2>
          <p className="sui-text-gray-600">
            For the complete guide with detailed examples, props reference, and advanced usage patterns, 
            see the <code className="sui-bg-gray-100 sui-px-1 sui-rounded">GUIDE.md</code> file in the component directory.
          </p>
        </section>
      </div>
    </div>
  ),
};
