import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { Toggle } from "../../index";

const meta = {
  title: "Components/Toggle",
  component: Toggle,
  parameters: {
    componentSubtitle: "A simple on/off switch component.",
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/file/B9YbaCM1s3RdIe9kLCLRcu/%F0%9F%92%BB-Web-App-%E2%80%94-Base-Components?node-id=3%3A6128&mode=dev",
    },
  },
  argTypes: {
    on: { control: "boolean" },
    disabled: { control: "boolean" },
    name: { control: "text" },
  },
  args: {
    onClick: fn(),
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Controlled: Story = {
  render: function Render(args) {
    const [isOn, setIsOn] = useState(true);
    return (
      <Toggle
        {...args}
        on={isOn}
        onClick={(e: React.MouseEvent<HTMLInputElement>) => {
          setIsOn(!isOn);
          args.onClick?.(e);
        }}
      />
    );
  },
  args: {
    name: "toggle-controlled",
    disabled: false,
  },
};

export const Uncontrolled: Story = {
  args: {
    name: "toggle-uncontrolled",
    // In uncontrolled mode, the component manages its own state.
    // We can set the initial default state if the component supports it.
    defaultOn: true,
  },
};

export const Disabled: Story = {
  args: {
    name: "toggle-disabled-on",
    on: true,
    disabled: true,
  },
};
