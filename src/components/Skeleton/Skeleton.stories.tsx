import type { Meta, StoryObj } from "@storybook/react";
import { Skeleton } from "../../index";

const meta = {
  component: Skeleton,
  title: "Components/Skeleton",
  parameters: {
    componentSubtitle: (
      <p>
        This is an easy to use Skeleton component, it can be shape to any form
        you want, here are some examples of how you can use it.
      </p>
    ),
    design: {
      type: "figma",
      url: "https://www.figma.com/design/CWUy01jQ8LS4J1Q64xJ9LC/%F0%9F%93%90-Financial-Reporting-Updates?node-id=7634-28214&m=dev",
    },
    layout: "centered",
  },
  argTypes: {
    className: {
      control: "text",
      description:
        "Standard tailwind and css classes to control width, height, shape, etc.",
    },
  },
  decorators: [
    (Story) => (
      <div className="sui-w-full sui-max-w-xl sui-p-4">
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleCard: Story = {
  render: () => (
    <div className="sui-rounded sui-border sui-border-solid sui-border-neutral-border sui-p-3">
      <div className="sui-mb-4 sui-flex sui-items-center sui-gap-2 sui-pr-3">
        <Skeleton className="sui-h-[50px] sui-w-[50px] sui-rounded-full" />
        <Skeleton className="sui-h-4 sui-w-[200px]" />
      </div>
      <div className="sui-grid sui-gap-2">
        <Skeleton className="sui-h-4 sui-w-full" />
        <Skeleton className="sui-h-4 sui-w-full" />
        <Skeleton className="sui-h-4 sui-w-[100px]" />
      </div>
    </div>
  ),
};

export const KeyInsightsCard: Story = {
  render: () => (
    <div className="sui-w-full sui-max-w-[420px] sui-rounded sui-bg-neutral-background-weak sui-p-4">
      <div className="sui-mb-4 sui-flex sui-gap-3">
        <div>
          <Skeleton className="sui-mb-2 sui-h-[12px] sui-w-[50px]" />
          <Skeleton className="sui-h-[30px] sui-w-[80px]" />
        </div>
        <div>
          <Skeleton className="sui-mb-2 sui-h-[12px] sui-w-[50px]" />
          <Skeleton className="sui-h-[30px] sui-w-[80px]" />
        </div>
        <div>
          <Skeleton className="sui-mb-2 sui-h-[12px] sui-w-[50px]" />
          <Skeleton className="sui-h-[30px] sui-w-[80px]" />
        </div>
      </div>
      <div className="sui-flex sui-items-center sui-gap-1">
        <Skeleton className="sui-h-4 sui-w-4" />
        <Skeleton className="sui-h-4 sui-w-[200px]" />
      </div>
    </div>
  ),
};

// A component to render a single skeleton table row to keep the main story clean
const TableRowSkeleton = () => (
  <tr className="sui-border-b sui-border-solid sui-border-gray-90">
    <td className="sui-px-2 sui-py-3">
      <Skeleton className="sui-h-4 sui-w-[60px]" />
    </td>
    <td className="sui-px-2 sui-py-3 sui-pr-[100px]">
      <Skeleton className="sui-h-4 sui-w-[240px]" />
    </td>
    <td className="sui-px-2 sui-py-3">
      <Skeleton className="sui-h-4 sui-w-[90px]" />
    </td>
    <td className="sui-px-2 sui-py-3">
      <Skeleton className="sui-h-4 sui-w-[60px]" />
    </td>
    <td className="sui-px-2 sui-py-3">
      <Skeleton className="sui-h-4 sui-w-[120px]" />
    </td>
  </tr>
);

export const Table: Story = {
  parameters: {
    layout: "fullscreen",
  },
  render: () => (
    <div className="sui-p-4">
      <table className="sui-w-full">
        <thead>
          <tr className="sui-border-b-2 sui-border-solid sui-border-gray-90">
            <th className="sui-p-2 sui-text-left">
              <Skeleton className="sui-h-4 sui-w-[80px]" />
            </th>
            <th className="sui-p-2 sui-pr-[100px] sui-text-left">
              <Skeleton className="sui-h-4 sui-w-[110px]" />
            </th>
            <th className="sui-p-2 sui-text-left">
              <div className="sui-flex sui-items-center sui-gap-1">
                <Skeleton className="sui-h-4 sui-w-[100px]" />
                <Skeleton className="sui-h-4 sui-w-4" />
              </div>
            </th>
            <th className="sui-p-2 sui-text-left">
              <div className="sui-flex sui-items-center sui-gap-1">
                <Skeleton className="sui-h-4 sui-w-[100px]" />
                <Skeleton className="sui-h-4 sui-w-4" />
              </div>
            </th>
            <th className="sui-p-2 sui-text-left">
              <Skeleton className="sui-h-4 sui-w-[50px]" />
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 9 }).map((_, i) => (
            <TableRowSkeleton key={i} />
          ))}
        </tbody>
      </table>
    </div>
  ),
};
