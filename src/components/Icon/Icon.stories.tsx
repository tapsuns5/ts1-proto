import type { Meta, StoryObj } from "@storybook/react";
import { Icon } from "../../index";
import { ICON_NAMES } from "./Icon.types";

const meta = {
  title: "Components/Icon",
  component: Icon,
  parameters: {
    componentSubtitle: "Using Google Material Symbols",
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/file/PVOAptZzuusZjr05qY0dJO/%F0%9F%92%BB-Web-App-%E2%80%94-Foundations?type=design&node-id=3%3A1014&mode=design&t=Jl3S9NBcxcb3yJ3P-1",
    },
  },
  argTypes: {
    name: { control: "select", options: ICON_NAMES },
    size: { control: "radio", options: ["xs", "s", "default", "l", "xl"] },
    filled: { control: "boolean" },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "settings",
    size: "default",
    filled: false,
  },
};
