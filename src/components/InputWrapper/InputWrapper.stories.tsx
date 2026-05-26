import type { Meta, StoryObj } from "@storybook/react";
import { InputWrapper } from "../../index";

const meta = {
  title: "Components/InputWrapper",
  component: InputWrapper,
  parameters: {
    componentSubtitle: "InputWrapper variations",
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/file/B9YbaCM1s3RdIe9kLCLRcu/%F0%9F%92%BB-Web-App-%E2%80%94-Base-Components?type=design&node-id=1047-48667&mode=dev",
    },
  },
  argTypes: {
    label: { control: "text" },
    name: { control: "text" },
    required: { control: "boolean" },
    children: { control: undefined }, // Children are passed directly in the story
  },
  decorators: [
    (Story) => (
      <div style={{ width: "100%", minWidth: "320px" }}>
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof InputWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "First Name",
    name: "first_name",
    required: true,
    children: (
      <input
        type="text"
        name="first_name"
        className="sui-h-8 sui-w-full sui-rounded sui-border sui-border-solid sui-border-neutral-border sui-p-2"
      />
    ),
  },
};
