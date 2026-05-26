import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { IconButton } from "../../index";
import { ICON_NAMES } from "../Icon/Icon.types";

const meta = {
  title: "Components/IconButton",
  component: IconButton,
  parameters: {
    componentSubtitle: "Button variations with icon",
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/file/B9YbaCM1s3RdIe9kLCLRcu/%F0%9F%92%BB-Web-App-%E2%80%94-Base-Components?type=design&node-id=1175%3A34968&mode=dev",
    },
  },
  argTypes: {
    icon: { control: "select", options: ICON_NAMES },
    variant: {
      control: "select",
      options: ["default", "neutral", "consumer", "negative"],
    },
    disabled: { control: "boolean" },
    withBorder: { control: "boolean" },
    size: {
      control: "radio",
      options: ["default", "compact"],
    },
  },
  args: {
    onClick: fn(),
    icon: "edit",
    variant: "default",
    disabled: false,
    withBorder: false,
    size: "default",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: "default",
  },
};

export const Neutral: Story = {
  args: {
    variant: "neutral",
  },
};

export const Consumer: Story = {
  args: {
    variant: "consumer",
  },
};

export const Negative: Story = {
  args: {
    variant: "negative",
  },
};

export const WithBorder: Story = {
  args: {
    withBorder: true,
  },
};

export const Compact: Story = {
  args: {
    size: "compact",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const All: Story = {
  render: () => (
    <div className="sui-grid sui-grid-cols-4 sui-gap-4">
      <IconButton icon="edit" size="compact" />
      <IconButton icon="edit" variant="neutral" size="compact" />
      <IconButton icon="edit" variant="consumer" size="compact" />
      <IconButton icon="edit" variant="negative" size="compact" />
      <IconButton icon="edit" size="compact" withBorder />
      <IconButton icon="edit" variant="neutral" size="compact" withBorder />
      <IconButton icon="edit" variant="consumer" size="compact" withBorder />
      <IconButton icon="edit" variant="negative" size="compact" withBorder />
      <IconButton icon="edit" />
      <IconButton icon="edit" variant="neutral" />
      <IconButton icon="edit" variant="consumer" />
      <IconButton icon="edit" variant="negative" />
      <IconButton icon="edit" withBorder />
      <IconButton icon="edit" variant="neutral" withBorder />
      <IconButton icon="edit" variant="consumer" withBorder />
      <IconButton icon="edit" variant="negative" withBorder />
    </div>
  ),
};
