import { SetStateAction, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { Input } from "../../index";
import { TooltipProvider } from "../Tooltip/Tooltip";
import { COUNTRY_OPTIONS, STATE_OPTIONS } from "./constants";

const meta = {
  title: "Components/Input",
  component: Input,
  parameters: {
    componentSubtitle: "Input variations",
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/file/B9YbaCM1s3RdIe9kLCLRcu/%F0%9F%92%BB-Web-App-%E2%80%94-Base-Components?type=design&node-id=1047-48667&mode=dev",
    },
  },
  argTypes: {
    type: {
      control: "select",
      options: [
        "text",
        "email",
        "date",
        "datetime",
        "number",
        "phone",
        "financial",
        "textarea",
        "select",
        "password",
      ],
    },
    label: { control: "text" },
    leftIcon: { control: "text" },
    allowClear: { control: "boolean" },
    allowDecimals: { control: "boolean" },
    allowCountryCode: { control: "boolean" },
    currency: { control: "text" },
    maxChars: { control: "number" },
    errors: { control: "object" },
  },
  args: {
    onChange: fn(),
  },
  decorators: [
    (Story) => (
      <div style={{ width: "100%", maxWidth: "320px" }}>
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TextInput: Story = {
  args: {
    type: "text",
    label: "First Name",
    name: "first_name",
  },
};

export const TextInputWithLeftIcon: Story = {
  render: function Render(args) {
    const [value, setValue] = useState("");
    return (
      <Input
        {...args}
        value={value}
        onChange={(e: { target: { value: SetStateAction<string> } }) => {
          setValue(e.target.value);
          args.onChange(e);
        }}
      />
    );
  },
  args: {
    type: "text",
    label: "Cities",
    name: "cities",
    leftIcon: "search",
  },
};

export const TextInputWithClear: Story = {
  ...TextInputWithLeftIcon,
  args: {
    type: "text",
    label: "Cities",
    name: "cities",
    allowClear: true,
    placeholder: "Start typing...",
  },
};

export const EmailInput: Story = {
  args: {
    type: "email",
    label: "Email",
    name: "email",
  },
};

export const DateInput: Story = {
  args: {
    type: "date",
    label: "Date",
    name: "date",
    size: "small",
  },
};

export const DateTimeInput: Story = {
  args: {
    type: "datetime",
    label: "Datetime",
    name: "datetime",
  },
};

export const NumberInput: Story = {
  args: {
    type: "number",
    label: "Number",
    name: "number",
    allowDecimals: true,
  },
};

export const NumberInputWithDecimalLimit: Story = {
  render: function Render(args) {
    const [value, setValue] = useState("");
    return (
      <Input
        {...args}
        value={value}
        onChange={(e: { target: { value: SetStateAction<string> } }) => {
          setValue(e.target.value);
          args.onChange(e);
        }}
      />
    );
  },
  args: {
    type: "number",
    label: "Number (max 5 decimals)",
    name: "number_decimal_limit",
    allowDecimals: true,
    decimalLimit: 5,
  },
};

export const PhoneInput: Story = {
  args: {
    type: "phone",
    label: "Phone Number",
    name: "phone_number",
    allowCountryCode: true,
  },
};

export const FinancialInput: Story = {
  args: {
    type: "financial",
    label: "Amount",
    name: "amount",
    currency: "USD",
    allowDecimals: true,
  },
};

export const FinancialInputWithDecimalLimit: Story = {
  render: function Render(args) {
    const [value, setValue] = useState("");
    return (
      <Input
        {...args}
        value={value}
        onChange={(e: { target: { value: SetStateAction<string> } }) => {
          setValue(e.target.value);
          args.onChange(e);
        }}
      />
    );
  },
  args: {
    type: "financial",
    label: "Amount (max 2 decimals)",
    name: "amount_decimal_limit",
    currency: "USD",
    allowDecimals: true,
    decimalLimit: 2,
  },
};

export const TextareaInput: Story = {
  // radius override
  render: function Render(args) {
    const [value, setValue] = useState("");
    return (
      <Input
        {...args}
        value={value}
        onChange={(e: { target: { value: SetStateAction<string> } }) => {
          setValue(e.target.value);
          args.onChange(e);
        }}
      />
    );
  },
  args: {
    type: "textarea",
    label: "Message",
    name: "message",
    maxChars: 250,
  },
};

export const WithError: Story = {
  args: {
    type: "text",
    label: "First Name",
    name: "first_name",
    value: "John",
    errors: ["First name is required"],
  },
};

export const WithDateRange: Story = {
  args: {
    type: "date",
    label: "Date with range",
    name: "date",
    inputProps: {
      min: "2023-01-01",
      max: "2023-12-31",
    },
  },
};

export const CountrySelect: Story = {
  args: {
    type: "select",
    label: "Country",
    name: "country",
    options: COUNTRY_OPTIONS,
  },
};

export const StateSelect: Story = {
  args: {
    type: "select",
    label: "State",
    name: "state",
    options: STATE_OPTIONS,
  },
};

export const SelectWithPlaceholder: Story = {
  render: function Render(args) {
    const [value, setValue] = useState("");
    return (
      <Input
        {...args}
        value={value}
        onChange={(e: { target: { value: SetStateAction<string> } }) => {
          setValue(e.target.value);
          args.onChange(e);
        }}
      />
    );
  },
  args: {
    type: "select",
    label: "Required option",
    required: true,
    name: "foo",
    placeholder: "Select an option",
    options: [
      { value: "foo", label: "Foo" },
      { value: "bar", label: "Bar" },
    ],
  },
};

export const Password: Story = {
  args: {
    type: "password",
    label: "Enter your password",
    name: "current_password",
    inputProps: {
      autoComplete: "current-password",
    },
  },
};

export const ReadOnly: Story = {
  args: {
    type: "text",
    label: "Read Only",
    name: "username",
    value: "read only value",
    inputProps: {
      readOnly: true,
    },
  },
};

export const WithHelp: Story = {
  render: (args) => (
    <TooltipProvider>
      <Input {...args} />
    </TooltipProvider>
  ),
  args: {
    type: "text",
    label: "Card Number",
    name: "card_number",
    showHelpIcon: true,
    helpIconTooltipContent: "This is an important info.",
  },
};
