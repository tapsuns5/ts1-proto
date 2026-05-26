import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { Calendar } from "../../index";

// Metadata to configure how stories for this component are displayed
const meta = {
  component: Calendar,
  title: "Components/Calendar",
  parameters: {
    // Center the component and provide space for the calendar to pop up
    layout: "centered",
    componentSubtitle: (
      <div>
        <p className="sui-mb-1">
          A calendar component made with ReactDatePicker lib.
        </p>
        <div className="sui-grid">
          <a
            href="https://github.com/Hacker0x01/react-datepicker?tab=readme-ov-file#react-date-picker"
            target="_blank"
            rel="noreferrer"
            className="sui-text-desktop-5"
          >
            ReactDatePicker API Reference
          </a>
        </div>
      </div>
    ),
  },
  // This component will have an automatically generated Autodocs entry
  tags: ["autodocs"],
  // Define default arguments for all stories
  args: {
    onChange: fn(),
  },
  // Add a decorator to ensure the calendar has enough space to display without being cut off
  decorators: [
    (Story) => (
      <div style={{ minHeight: "400px" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

// The default story demonstrates a controlled Calendar component.
// It uses the `render` function to manage the selected date state via `useState`.
export const Default: Story = {
  render: function Render(args) {
    const [date, setDate] = useState<Date | undefined>(undefined);

    return (
      <Calendar
        {...args}
        selected={date}
        onChange={(
          newDate: Date | null,
          event?:
            | React.MouseEvent<HTMLElement>
            | React.KeyboardEvent<HTMLElement>,
        ) => {
          setDate(newDate ?? undefined);
          // Also call the mocked function from args so it appears in the actions panel
          args.onChange?.(newDate, event);
        }}
      />
    );
  },
};
