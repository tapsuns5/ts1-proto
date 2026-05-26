import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from "../../index";

// Metadata to configure how stories for this component are displayed
const meta = {
  title: "Components/Avatar",
  component: Avatar,
  parameters: {
    // Center the component in the Canvas
    layout: "centered",
    componentSubtitle: "Main (optional) description on Storybook Docs page",
    design: {
      type: "figma",
      url: "https://www.figma.com/file/B9YbaCM1s3RdIe9kLCLRcu/%F0%9F%92%BB-Web-App-%E2%80%94-Base-Components?node-id=1116%3A29929&mode=dev",
    },
  },
  // This component will have an automatically generated Autodocs entry
  tags: ["autodocs"],
  // Define argTypes for better control in Storybook UI
  argTypes: {
    type: {
      control: { type: "select" },
      options: ["initials", "picture", "placeholder"],
    },
    size: {
      control: { type: "select" },
      options: ["small", "medium", "large", "xl"],
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

// Story for the default Avatar (initials)
export const Default: Story = {
  args: {
    type: "initials",
    initials: "TS",
    size: "default",
  },
};

// Story for the picture Avatar
export const Picture: Story = {
  args: {
    type: "picture",
    size: "xl",
    src: "https://placehold.co/150x150/E0E0E0/000000?text=Avatar",
  },
};

// Story for the placeholder Avatar
export const Placeholder: Story = {
  args: {
    type: "placeholder",
    size: "large",
  },
};
