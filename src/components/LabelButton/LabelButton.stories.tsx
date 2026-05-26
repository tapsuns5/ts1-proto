import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { LabelButton } from "../../index";
import { ICON_NAMES } from "../Icon/Icon.types";

const meta = {
  title: "Components/LabelButton",
  component: LabelButton,
  parameters: {
    componentSubtitle: "Button variations with label and optional icon",
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/file/B9YbaCM1s3RdIe9kLCLRcu/%F0%9F%92%BB-Web-App-%E2%80%94-Base-Components?type=design&node-id=848-36887&mode=dev",
    },
  },
  argTypes: {
    icon: { control: "select", options: ICON_NAMES },
    variantType: {
      control: "radio",
      options: ["primary", "secondary", "tertiary", "outlined"],
    },
    size: { control: "radio", options: ["default", "large", "small"] },
    sentiment: {
      control: "radio",
      options: ["default", "negative", "success", "consumer"],
    },
    iconPosition: { control: "radio", options: ["left", "right"] },
    children: { control: undefined },
    labelText: { control: "text" },
    disabled: { control: "boolean" },
    loading: { control: "boolean" },
  },
  args: {
    onClick: fn(),
  },
  tags: ["autodocs"],
} satisfies Meta<typeof LabelButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    labelText: "Button",
    icon: "add",
    variantType: "primary",
    size: "default",
    sentiment: "default",
    iconPosition: "left",
    disabled: false,
    loading: false,
  },
};

export const IconLeft: Story = {
  args: {
    ...Default.args,
    labelText: "Previous",
    icon: "chevron_left",
    iconPosition: "left",
  },
};

export const IconRight: Story = {
  args: {
    ...Default.args,
    labelText: "Next",
    icon: "chevron_right",
    iconPosition: "right",
  },
};

export const NoIcon: Story = {
  args: {
    ...Default.args,
    labelText: "Close",
    icon: undefined,
  },
};

export const SubmitButton: Story = {
  render: function Render(args) {
    const [loading, setLoading] = useState(false);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      setLoading(true);
      args.onClick(e);
      // Simulate a network request
      setTimeout(() => setLoading(false), 2000);
    };

    return <LabelButton {...args} loading={loading} onClick={handleClick} />;
  },
  args: {
    ...Default.args,
    labelText: "Submit",
    icon: undefined,
  },
};

export const AsChild: Story = {
  args: {
    ...Default.args,
    variantType: "secondary",
    children: (
      <a href="https://google.com" target="_blank" rel="noreferrer">
        Child Link
      </a>
    ),
    asChild: true,
  },
};
