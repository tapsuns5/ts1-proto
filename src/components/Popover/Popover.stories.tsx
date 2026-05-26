import type { Meta, StoryObj } from "@storybook/react";
import {
  LabelButton,
  Popover,
  PopoverClose,
  PopoverCloseIcon,
  PopoverContent,
  PopoverTrigger,
} from "../../index";

const meta = {
  title: "Components/Popover",
  component: Popover,
  parameters: {
    componentSubtitle: (
      <div>
        <p className="sui-mb-1">
          Displays rich content in a portal, triggered by a button or slot
          component. Uses Radix popover primative under the hood.
        </p>
        <div className="sui-grid">
          <a
            href="https://www.radix-ui.com/primitives/docs/components/popover#api-reference"
            target="_blank"
            rel="noreferrer"
            className="sui-text-desktop-5"
          >
            Popover API Reference
          </a>
        </div>
      </div>
    ),
    design: {
      type: "figma",
      url: "https://www.figma.com/file/B9YbaCM1s3RdIe9kLCLRcu/",
    },
  },
  argTypes: {
    // @ts-expect-error check how pass here props form composite components
    portal: {
      control: "boolean",
      description:
        "Default true, set false in certain use cases where you want the popover to be rendered in the same container as the trigger",
    },
    align: {
      control: "select",
      options: ["start", "center", "end"],
    },
    side: {
      control: "select",
      options: ["top", "right", "bottom", "left"],
    },
    alignOffset: { control: "number" },
    sideOffset: { control: "number" },
    // Documentation-only argTypes
    "<Popover />": { control: null },
    "<PopoverTrigger />": { control: null },
    "<PopoverContent />": { control: null },
    "<PopoverClose />": { control: null },
    "<PopoverCloseIcon />": { control: null },
  },
  decorators: [
    (Story) => (
      <div className="sui-flex sui-min-h-[300px] sui-items-center sui-justify-center sui-bg-neutral-background-weak">
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

const ExampleContent = () => (
  <>
    <div className="sui-mb-1 sui-heading-sm">Popover content</div>
    <p className="sui-mb-2">This can be anything you want</p>
  </>
);

const defaultArgs = {
  alignOffset: 0,
  sideOffset: 5,
  align: "center",
  side: "bottom",
  portal: true,
};

export const Default: Story = {
  // @ts-expect-error check how pass here props form composite components
  args: {
    ...defaultArgs,
  },
  render: (args) => (
    <Popover>
      <PopoverTrigger asChild>
        <span className="sui-text-action-text-default sui-cursor-pointer hover:sui-underline">
          Text trigger
        </span>
      </PopoverTrigger>
      <PopoverContent {...args}>
        <ExampleContent />
      </PopoverContent>
    </Popover>
  ),
};

export const WithCloseIcon: Story = {
  // @ts-expect-error check how pass here props form composite components
  args: {
    ...defaultArgs,
  },
  render: (args) => (
    <Popover>
      <PopoverTrigger asChild>
        <span className="sui-text-action-text-default sui-cursor-pointer hover:sui-underline">
          Text trigger
        </span>
      </PopoverTrigger>
      <PopoverContent className="sui-pt-2" {...args}>
        <ExampleContent />
        <PopoverCloseIcon />
      </PopoverContent>
    </Popover>
  ),
};

export const WithCustomButtons: Story = {
  // @ts-expect-error check how pass here props form composite components
  args: {
    ...defaultArgs,
  },
  render: (args) => (
    <Popover>
      <PopoverTrigger asChild>
        <LabelButton labelText="Trigger" />
      </PopoverTrigger>
      <PopoverContent {...args}>
        <ExampleContent />
        <PopoverClose asChild>
          <LabelButton variantType="tertiary" labelText="Close" />
        </PopoverClose>
      </PopoverContent>
    </Popover>
  ),
};
