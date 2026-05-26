import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { TextLink } from "./TextLink";
import { ICON_NAMES } from "../Icon/Icon.types";

const meta = {
  title: "Components/TextLink",
  component: TextLink,
  parameters: {
    componentSubtitle:
      "TextLink is generally used for links only. Use tertiary label buttons if the need is a CTA.",
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/file/B9YbaCM1s3RdIe9kLCLRcu/%F0%9F%92%BB-Web-App-%E2%80%94-Base-Components?node-id=3%3A5911&mode=dev",
    },
  },
  argTypes: {
    children: { control: "text" },
    variantType: {
      control: "radio",
      options: ["primary", "secondary"],
    },
    sentiment: {
      control: "radio",
      options: ["default", "negative", "success"],
    },
    disabled: { control: "boolean" },
    href: { control: "text" },
    icon: {
      control: "select",
      options: ["", ...ICON_NAMES],
      mapping: { "": undefined },
    },
    iconPosition: {
      control: "radio",
      options: ["left", "right"],
    },
  },
  args: {
    onClick: fn(),
    href: "#",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TextLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: "Link",
    variantType: "primary",
  },
};

export const PrimaryDisabled: Story = {
  args: {
    ...Primary.args,
    disabled: true,
  },
};

export const Secondary: Story = {
  args: {
    ...Primary.args,
    variantType: "secondary",
  },
};

export const SecondaryDisabled: Story = {
  args: {
    ...Secondary.args,
    disabled: true,
  },
};

export const NegativeSentiment: Story = {
  args: {
    ...Primary.args,
    sentiment: "negative",
  },
};

export const NegativeSentimentDisabled: Story = {
  args: {
    ...NegativeSentiment.args,
    disabled: true,
  },
};

export const SuccessSentiment: Story = {
  args: {
    ...Primary.args,
    sentiment: "success",
  },
};

export const SuccessSentimentDisabled: Story = {
  args: {
    ...SuccessSentiment.args,
    disabled: true,
  },
};

export const WithIconLeft: Story = {
  args: {
    children: "Add item",
    variantType: "primary",
    icon: "add",
  },
};

export const WithIconRight: Story = {
  args: {
    children: "Open link",
    variantType: "primary",
    icon: "open_in_new",
    iconPosition: "right",
  },
};

export const SecondaryWithIcon: Story = {
  args: {
    children: "Add item",
    variantType: "secondary",
    icon: "add",
  },
};

export const AsButton: Story = {
  args: {
    children: "Link",
    variantType: "primary",
    href: undefined,
  },
};

export const AsButtonWithIcon: Story = {
  args: {
    children: "Add item",
    variantType: "primary",
    icon: "add",
    href: undefined,
  },
};

export const AsButtonDisabled: Story = {
  args: {
    children: "Link",
    variantType: "primary",
    disabled: true,
    href: undefined,
  },
};

export const InlineWithText: Story = {
  args: {
    children: "account preferences",
    variantType: "primary",
    href: "#",
  },
  render: (args) => (
    <p className="sui-text-body">
      To manage your account settings, visit the{" "}
      <TextLink {...args} /> page for more details.
    </p>
  ),
};

export const InlineWithIcon: Story = {
  args: {
    children: "our help center",
    variantType: "primary",
    href: "#",
    icon: "open_in_new",
    iconPosition: "right",
  },
  render: (args) => (
    <p className="sui-text-body">
      View the full documentation on{" "}
      <TextLink {...args} /> for more details.
    </p>
  ),
};
