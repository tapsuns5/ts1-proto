import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { RichTextEditor } from "../../index";

const meta = {
  title: "Components/RichTextEditor",
  component: RichTextEditor,
  parameters: {
    componentSubtitle: "Rich text edting component using TinyMCE.",
    layout: "fullscreen",
    design: {
      type: "figma",
      url: "https://www.figma.com/file/B9YbaCM1s3RdIe9kLCLRcu/%F0%9F%92%BB-Web-App-%E2%80%94-Base-Components?type=design&node-id=422-33449&mode=dev",
    },
  },
  argTypes: {
    initialValue: { control: "text" },
    placeholder: { control: "text" },
    height: { control: "number" },
    tinymceApiKey: { control: "text" },
  },
  args: {
    onChange: fn(),
  },
  tags: ["autodocs"],
} satisfies Meta<typeof RichTextEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    initialValue: "<p>This is the initial content of the editor.</p>",
    placeholder: "e.g. Please send documents to....",
    height: 500,
    // Replace with your actual TinyMCE API key
    tinymceApiKey: "your-api-key",
  },
};
