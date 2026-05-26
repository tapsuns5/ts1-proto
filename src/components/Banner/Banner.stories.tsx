import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { Banner } from "../../index";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogTrigger,
} from "../Dialog/Dialog";
import LabelButton from "../LabelButton/LabelButton";

// Metadata to configure how stories for this component are displayed
const meta = {
  title: "Components/Banner",
  component: Banner,
  parameters: {
    // Banners are typically full-width, so fullscreen layout is appropriate
    layout: "fullscreen",
    componentSubtitle: "Main (optional) description on Storybook Docs page",
    design: {
      type: "figma",
      url: "https://www.figma.com/file/B9YbaCM1s3RdIe9kLCLRcu/%F0%9F%92%BB-Web-App-%E2%80%94-Base-Components?type=design&node-id=1118-30760&mode=dev",
    },
  },
  // This component will have an automatically generated Autodocs entry
  tags: ["autodocs"],
  // Define argTypes for better control in Storybook UI
  argTypes: {
    sentiment: {
      control: "select",
      options: ["info", "warning", "negative", "success", undefined],
    },
    title: { control: "text" },
    caption: { control: "text" }, // Note: JSX provided in args cannot be edited via controls
  },
} satisfies Meta<typeof Banner>;

export default meta;
type Story = StoryObj<typeof meta>;

// Base args for stories with a title and caption to reduce repetition
const baseArgs = {
  title: "Title",
  caption: "Caption",
};

// Base args for stories that include a labeled action button
const actionArgs = {
  closeFn: fn(),
  action: {
    label: "action",
    onClick: fn(),
  },
};

// Base args for stories that include an action button without a label
const actionNoLabelArgs = {
  closeFn: fn(),
  action: {
    label: null,
    onClick: fn(),
  },
};

export const Primary: Story = {
  args: {
    caption: (
      <ul className="sui-pl-2">
        <li>item one</li>
        <li>item two</li>
      </ul>
    ),
  },
};

export const Info: Story = {
  args: {
    ...baseArgs,
    sentiment: "info",
  },
};

export const Warning: Story = {
  args: {
    ...baseArgs,
    sentiment: "warning",
  },
};

export const Negative: Story = {
  args: {
    ...baseArgs,
    sentiment: "negative",
  },
};

export const Success: Story = {
  args: {
    ...baseArgs,
    sentiment: "success",
  },
};

export const SuccessAction: Story = {
  args: {
    ...baseArgs,
    sentiment: "success",
    ...actionArgs,
  },
};

export const InfoAction: Story = {
  args: {
    ...baseArgs,
    sentiment: "info",
    ...actionArgs,
  },
};

export const WarningAction: Story = {
  args: {
    ...baseArgs,
    sentiment: "warning",
    ...actionArgs,
  },
};

// Renamed from ErrorAction to be consistent with the 'negative' sentiment
export const NegativeAction: Story = {
  args: {
    ...baseArgs,
    sentiment: "negative",
    ...actionArgs,
  },
};

// Renamed from ErrorActionNoLabel
export const NegativeActionNoLabel: Story = {
  args: {
    ...baseArgs,
    sentiment: "negative",
    ...actionNoLabelArgs,
  },
};

export const SuccessActionNoLabel: Story = {
  args: {
    ...baseArgs,
    sentiment: "success",
    ...actionNoLabelArgs,
  },
};

export const InfoActionNoLabel: Story = {
  args: {
    ...baseArgs,
    sentiment: "info",
    ...actionNoLabelArgs,
  },
};

export const WarningActionNoLabel: Story = {
  args: {
    ...baseArgs,
    sentiment: "warning",
    ...actionNoLabelArgs,
  },
};

export const UnlabeledAction: Story = {
  args: {
    ...baseArgs,
    sentiment: "negative",
    action: {
      label: null,
      onClick: fn(),
    },
  },
};

export const CloseOnly: Story = {
  args: {
    ...baseArgs,
    sentiment: "negative",
    closeFn: fn(),
  },
};

export const TitleOnlyInfo: Story = {
  args: {
    title: "This is a title only banner",
    sentiment: "info",
    ...actionArgs,
  },
};

export const TitleOnlyWarning: Story = {
  args: {
    title: "This is a title only banner",
    sentiment: "warning",
    ...actionArgs,
  },
};

export const TitleOnlyNegative: Story = {
  args: {
    title: "This is a title only banner",
    sentiment: "negative",
    ...actionArgs,
  },
};

export const TitleOnlySuccess: Story = {
  args: {
    title: "This is a title only banner",
    sentiment: "success",
    ...actionArgs,
  },
};

export const CaptionOnlyInfo: Story = {
  args: {
    caption: "This is a caption only banner",
    sentiment: "info",
    ...actionArgs,
  },
};

export const CaptionOnlyWarning: Story = {
  args: {
    caption: "This is a caption only banner",
    sentiment: "warning",
    ...actionArgs,
  },
};

export const CaptionOnlyNegative: Story = {
  args: {
    caption: "This is a caption only banner",
    sentiment: "negative",
    ...actionArgs,
  },
};

export const CaptionOnlySuccess: Story = {
  args: {
    caption: "This is a caption only banner",
    sentiment: "success",
    ...actionArgs,
  },
};

// Timer stories
export const TimerShortDuration: Story = {
  args: {
    ...baseArgs,
    sentiment: "info",
    timer: 30000, // 30 seconds
  },
};

export const TimerMediumDuration: Story = {
  args: {
    ...baseArgs,
    sentiment: "warning",
    timer: 150000, // 2 minutes 30 seconds
  },
};

export const TimerLongDuration: Story = {
  args: {
    ...baseArgs,
    sentiment: "success",
    timer: 600000, // 10 minutes
  },
};

export const TimerWithAction: Story = {
  args: {
    ...baseArgs,
    sentiment: "negative",
    timer: 45000, // 45 seconds
    ...actionArgs,
  },
};

export const TimerWithClose: Story = {
  args: {
    ...baseArgs,
    sentiment: "warning",
    timer: 60000, // 1 minute
    closeFn: fn(),
  },
};

export const TimerCaptionOnly: Story = {
  args: {
    caption: "This banner will dismiss automatically",
    sentiment: "info",
    timer: 25000, // 25 seconds
  },
};

export const InsideDialog: Story = {
  args: {
    title: "Editing is limited while a score is saved",
    caption:
      "Games with a saved score lock certain game details. Remove the score to edit them.",
    sentiment: "info",
    ...actionArgs,
  },
  render: (args) => (
    <Dialog defaultOpen>
      <DialogTrigger asChild>
        <LabelButton>Open Dialog</LabelButton>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="sui-heading-sm">
            Dialog with Banner
          </DialogTitle>
        </DialogHeader>
        <DialogBody className="sui-pb-3">
          <Banner className="sui-mb-2" {...args} />
        </DialogBody>
      </DialogContent>
    </Dialog>
  ),
};
