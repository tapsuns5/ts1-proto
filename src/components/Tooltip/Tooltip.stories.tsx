import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  LabelButton,
  TextLink,
  Tooltip,
  TooltipAction,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../index";

const meta = {
  title: "Components/Tooltip",
  component: Tooltip,
  parameters: {
    componentSubtitle: (
      <div>
        <p className="sui-mb-1">
          This is a Tooltip component made with RadixUI Tooltip.
        </p>
        <a
          href="https://www.radix-ui.com/primitives/docs/components/tooltip#api-reference"
          target="_blank"
          rel="noreferrer"
          className="sui-text-desktop-5"
        >
          Tooltip API Reference
        </a>
      </div>
    ),
    layout: "centered",
  },
  argTypes: {
    align: { control: "select", options: ["start", "center", "end"] },
    side: { control: "select", options: ["top", "right", "bottom", "left"] },
    // Documentation-only argTypes
    // @ts-expect-error check how to move this special case to a better place
    "<TooltipProvider />": { control: null },
    "<Tooltip />": { control: null },
    "<TooltipTrigger />": { control: null },
    "<TooltipContent />": { control: null },
    "<TooltipAction />": { control: null },
  },
  decorators: [
    (Story) => (
      <TooltipProvider>
        <div className="sui-flex sui-min-h-[300px] sui-items-center sui-justify-center">
          <Story />
        </div>
      </TooltipProvider>
    ),
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof Tooltip>;

const defaultArgs = {
  align: "center",
  side: "top",
};

export const Plain: Story = {
  render: (args) => (
    <Tooltip
      content="Simple plain tooltip to show small pieces of information."
      {...args}
    >
      <LabelButton size="small" variantType="secondary">
        Hover
      </LabelButton>
    </Tooltip>
  ),
  // @ts-expect-error
  args: {
    ...defaultArgs,
  },
};

export const Rich: Story = {
  render: (args) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <LabelButton size="small" variantType="secondary">
          Hover
        </LabelButton>
      </TooltipTrigger>
      <TooltipContent align={args.align} side={args.side}>
        <p className="sui-mb-1">
          This is a rich tooltip with an action. It can contain complex tags
          like an ordered list:
        </p>
        <ol className="sui-mb-1 sui-pl-2">
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
        </ol>
        Also a
        <TextLink
          href="https://www.google.com/"
          target="_blank"
          rel="noreferrer"
          className="sui-ml-0.5"
        >
          link
        </TextLink>{" "}
        to google for instance.
      </TooltipContent>
    </Tooltip>
  ),
  // @ts-expect-error
  args: {
    ...defaultArgs,
  },
};

export const WithAction: Story = {
  render: (args) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <LabelButton size="small" variantType="secondary">
          Hover
        </LabelButton>
      </TooltipTrigger>
      <TooltipContent align={args.align} side={args.side}>
        This is a rich tooltip with a custom action. This action can be useful
        to perform additional tasks like open a link, take the user to some
        other part of the page or to simply close the tooltip via a useState
        hook.
        <TooltipAction>Learn More</TooltipAction>
      </TooltipContent>
    </Tooltip>
  ),
  // @ts-expect-error
  args: {
    ...defaultArgs,
  },
};

export const WithManualClose: Story = {
  render: (args) => {
    const [open, setOpen] = useState(true);
    return (
      <Tooltip open={open} onOpenChange={setOpen}>
        <TooltipTrigger asChild>
          <LabelButton size="small" variantType="secondary">
            Click
          </LabelButton>
        </TooltipTrigger>
        <TooltipContent align={args.align} side={args.side}>
          <p className="sui-mb-1 sui-font-semibold">Manual Close</p>
          This tooltip is open by default and will only close when you click the
          button below.
          <TooltipAction onClick={() => setOpen(false)}>Got It</TooltipAction>
        </TooltipContent>
      </Tooltip>
    );
  },
  // @ts-expect-error
  args: {
    ...defaultArgs,
  },
};
