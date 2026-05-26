import type { Meta, StoryObj } from "@storybook/react";
import { HelpText } from "../../index";

const meta = {
  title: "Components/HelpText",
  component: HelpText,
  parameters: {
    componentSubtitle: "Help text atomic component.",
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/file/B9YbaCM1s3RdIe9kLCLRcu/%F0%9F%92%BB-Web-App-%E2%80%94-Base-Components?node-id=1115%3A27755&mode=dev",
    },
  },
  argTypes: {
    children: { control: "text" },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof HelpText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Help text goes here",
  },
};
