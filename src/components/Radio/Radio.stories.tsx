import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { Icon, Radio } from "../../index";

const meta = {
  title: "Components/Radio",
  component: Radio,
  parameters: {
    componentSubtitle: "Atomic Radio component.",
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/file/B9YbaCM1s3RdIe9kLCLRcu/%F0%9F%92%BB-Web-App-%E2%80%94-Base-Components?node-id=129%3A34671&mode=dev",
    },
  },
  argTypes: {
    label: { control: "text" },
    value: { control: "text" },
    caption: { control: "text" },
    name: { control: "text" },
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
    children: { control: undefined },
  },
  args: {
    onChange: fn(),
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithLabel: Story = {
  args: {
    label: "Button label",
    value: "string",
    name: "group-1",
  },
};

export const WithCaption: Story = {
  args: {
    ...WithLabel.args,
    caption: "Caption text",
    name: "group-2",
  },
};

export const Standalone: Story = {
  args: {
    name: "group-3",
  },
};

export const Group: Story = {
  render: function Render(args) {
    const [selectedValue, setSelectedValue] = useState("1");
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedValue(e.target.value);
      args.onChange(e);
    };
    return (
      <div className="sui-flex sui-flex-col sui-gap-2">
        <Radio
          {...args}
          label="Radio 1"
          name="radio-group"
          value="1"
          checked={selectedValue === "1"}
          onChange={handleChange}
        />
        <Radio
          {...args}
          label="Radio 2"
          name="radio-group"
          value="2"
          checked={selectedValue === "2"}
          onChange={handleChange}
        />
        <Radio
          {...args}
          label="Radio 3"
          name="radio-group"
          value="3"
          checked={selectedValue === "3"}
          onChange={handleChange}
        />
      </div>
    );
  },
};

export const CustomLabel: Story = {
  args: {
    label: "Radio 1",
    name: "radio-custom",
    value: "custom",
    children: (
      <>
        Custom label <Icon name="info" size="s" />
      </>
    ),
  },
};
