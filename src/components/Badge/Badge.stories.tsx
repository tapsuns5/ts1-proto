import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "../../index";

const meta = {
  title: "Components/Badge",
  component: Badge,
  parameters: {
    componentSubtitle: "A component to display different states.",
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/iNstL3nTw7jLPyL7uH4jLK/%F0%9F%92%BB-%F0%9F%9F%A3-Web-App-%E2%80%94-Base-Components-%E2%80%94-TS1?node-id=3-10370&t=uPpJTUHU1K7O1qsT-4", // Example URL
    },
  },
  argTypes: {
    labelText: { control: "text" },
    variant: {
      control: "select",
      options: [
        "positive",
        "caution1",
        "negative",
        "neutral",
        "accent",
        "caution2",
        "live",
        "white",
      ],
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    labelText: "Success",
    variant: "positive",
  },
};

export const Warning: Story = {
  args: {
    labelText: "Warning",
    variant: "caution1",
  },
};

export const Negative: Story = {
  args: {
    labelText: "Negative",
    variant: "negative",
  },
};

export const Info: Story = {
  args: {
    labelText: "Info",
    variant: "neutral",
  },
};

export const Accent: Story = {
  args: {
    labelText: "Accent",
    variant: "accent",
  },
};

export const Caution2: Story = {
  args: {
    labelText: "Caution2",
    variant: "caution2",
  },
};

export const Live: Story = {
  args: {
    labelText: "Live",
    variant: "live",
  },
};

export const White: Story = {
  args: {
    labelText: "White",
    variant: "white",
  },
};
