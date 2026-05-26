import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { PhoneInput } from "../../index";

const meta = {
  title: "Components/PhoneInput",
  component: PhoneInput,
  parameters: {
    componentSubtitle: "Phonenumber input",
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/file/B9YbaCM1s3RdIe9kLCLRcu/%F0%9F%92%BB-Web-App-%E2%80%94-Base-Components?type=design&node-id=1047-48667&mode=dev",
    },
  },
  argTypes: {
    name: { control: "text" },
    label: { control: "text" },
    defaultCountryCode: { control: "text" },
    value: { control: "text" },
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
} satisfies Meta<typeof PhoneInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "phone",
    label: "Phone Number",
    defaultCountryCode: "US",
  },
};

export const Controlled: Story = {
  render: function Render(args) {
    // The value for this component is expected to be a string
    const [value, setValue] = useState<string>("");
    return (
      <PhoneInput
        {...args}
        value={value}
        onChange={(
          e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
          >,
        ) => {
          setValue(e.target.value);
          args.onChange?.(e.target.value);
        }}
      />
    );
  },
  args: {
    ...Default.args,
  },
};
