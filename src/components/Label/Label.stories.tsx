import type { Meta, StoryObj } from "@storybook/react";
import { Label, TooltipProvider } from "../../index";

const meta = {
  title: "Components/Label",
  component: Label,
  parameters: {
    componentSubtitle: "Atomic label component.",
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/file/B9YbaCM1s3RdIe9kLCLRcu/%F0%9F%92%BB-Web-App-%E2%80%94-Base-Components?node-id=1115%3A27755&mode=dev",
    },
  },
  argTypes: {
    children: { control: "text" },
    htmlFor: { control: "text" },
    required: { control: "boolean" },
    showHelpIcon: { control: "boolean" },
    helpIconTooltipContent: { control: "text" },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Label text",
    htmlFor: "my-div",
  },
};

export const Required: Story = {
  args: {
    ...Default.args,
    required: true,
  },
};

export const WithHelpIcon: Story = {
  render: (args) => (
    <TooltipProvider>
      <Label {...args} />
    </TooltipProvider>
  ),
  args: {
    ...Default.args,
    showHelpIcon: true,
    helpIconTooltipContent: "This is an important info.",
  },
};
