import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { ModalContainer } from "../../index";

// Metadata to configure how stories for this component are displayed
const meta = {
  title:
    "Deprecated/ModalContainer [Deprecated use the Dialog component instead]",
  component: ModalContainer,
  parameters: {
    // Optional parameter to center the component in the Canvas.
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    backgroundColor: { control: "color" },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked
  args: { onClick: fn() },
} satisfies Meta<typeof ModalContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    children: "Label text",
    htmlFor: "my-div",
  },
};
