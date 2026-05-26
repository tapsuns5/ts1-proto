import type { Meta, StoryObj } from "@storybook/react";
import { Status } from "../../index";

const meta = {
  title: "Components/Status",
  component: Status,
  parameters: {
    componentSubtitle: "A component to display different states.",
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/file/B9YbaCM1s3RdIe9kLCLRcu/%F0%9F%92%BB-Web-App-%E2%80%94-Base-Components?type=design&node-id=1118-30760&mode=dev", // Example URL
    },
  },
  argTypes: {
    text: { control: "text" },
    state: {
      control: "select",
      options: ["success", "warning", "negative", "info", "neutral"],
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Status>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    text: "Success",
    state: "success",
  },
};

export const Warning: Story = {
  args: {
    text: "Warning",
    state: "warning",
  },
};

export const Negative: Story = {
  args: {
    text: "Negative",
    state: "negative",
  },
};

export const Info: Story = {
  args: {
    text: "Info",
    state: "info",
  },
};
