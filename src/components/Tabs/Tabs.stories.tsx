import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { Tabs } from "../../index";

const meta = {
  title: "Components/Tabs",
  component: Tabs,
  parameters: {
    componentSubtitle: "Tabs is a component used for tabbed content.",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/B9YbaCM1s3RdIe9kLCLRcu/%F0%9F%92%BB-Web-App-%E2%80%94-Base-Components?node-id=4142-55016&t=FftftMOGnapOPudX-4",
    },
  },
  argTypes: {
    defaultValue: { control: "text" },
    tabs: { control: undefined }, // Tabs are complex objects, better to define in each story
  },
  decorators: [
    (Story) => (
      <div className="sui-py-4 lg:sui-px-4">
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultTabs = [
  {
    label: "Overview",
    value: "overview",
    content: <div className="sui-px-2 sui-py-3">Overview Content</div>,
  },
  {
    label: "Registered (174)",
    value: "registered",
    content: <div className="sui-px-2 sui-py-3">Registered Content</div>,
  },
  {
    label: "Waitlist (5)",
    value: "waitlist",
    content: <div className="sui-px-2 sui-py-3">Waitlist Content</div>,
  },
  {
    label: "In Progress (11)",
    value: "in-progress",
    content: <div className="sui-px-2 sui-py-3">In Progress Content</div>,
  },
  {
    label: "Cancelled (2)",
    value: "cancelled",
    content: <div className="sui-px-2 sui-py-3">Cancelled Content</div>,
  },
];

export const Default: Story = {
  args: {
    defaultValue: "overview",
    tabs: defaultTabs,
    // This is how we can improve the padding on mobile, since it depends on the project
    // preferable to approach it this way
    className: "[&>div>div]:sui-pl-2 lg:[&>div>div]:sui-pl-0",
  },
};

export const WithOnChange: Story = {
  args: {
    ...Default.args,
    onChange: fn(),
  },
};

export const ConsumerVariant: Story = {
  args: {
    ...Default.args,
    variantType: "consumer",
  },
};

export const WithOnTabClick: Story = {
  args: {
    ...Default.args,
    onTabClick: (tabValue: string) => {
      alert(`Tab clicked: ${tabValue}`);
    },
  },
};
