import type { Meta, StoryObj } from "@storybook/react";
import { Avatar, Card, IconButton } from "../../index";

// Metadata to configure how stories for this component are displayed
const meta = {
  component: Card,
  title: "Components/Card",
  parameters: {
    // Center the component in the Canvas
    layout: "centered",
    componentSubtitle: (
      <div>
        <p className="sui-mb-1">
          A Card component that can be used to display content.
        </p>
      </div>
    ),
    design: {
      type: "figma",
      url: "https://www.figma.com/file/Le1COFb31RaMF5MyRu4Mc2?type=design%27&node-id=2669:11142&mode=dev",
    },
  },
  // This component will have an automatically generated Autodocs entry
  tags: ["autodocs"],
  argTypes: {
    selected: { control: "boolean" },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

// The default story demonstrates a Card with content passed as children.
export const Default: Story = {
  args: {
    selected: false,
    className: "sui-py-2 sui-px-3 sui-flex sui-items-center sui-gap-2",
    children: (
      <>
        <Avatar type="initials" initials="LK" />
        <p className="sui-pr-4">Liam Klyneker</p>
        <IconButton icon="more_vert" size="compact" />
      </>
    ),
  },
};
