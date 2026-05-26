import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { Pagination, useTablePagination } from "../../../index";

const meta = {
  title: "Components/Pagination",
  component: Pagination,
  parameters: {
    componentSubtitle: "A component for navigating through pages.",
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/file/B9YbaCM1s3RdIe9kLCLRcu/%F0%9F%92%BB-Web-App-%E2%80%94-Base-Components?node-id=286%3A44975&mode=dev",
    },
  },
  argTypes: {
    totalCount: { control: "number" },
    currentPage: { control: "number" },
    pageSize: { control: "number" },
  },
  args: {
    onPageChange: fn(),
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    totalCount: 200,
    currentPage: 1,
    pageSize: 10,
  },
};

export const WithState: Story = {
  render: function Render(args) {
    const [currentPage, setCurrentPage] = useState(1);
    return (
      <Pagination
        {...args}
        currentPage={currentPage}
        onPageChange={(page: number) => {
          setCurrentPage(page);
          args.onPageChange(page);
        }}
      />
    );
  },
  args: {
    totalCount: 200,
    pageSize: 10,
    currentPage: 1,
  },
};

const mockRows = Array.from({ length: 50 }, (_, i) => ({ id: i + 1 }));

export const WithHook: Story = {
  args: {
    totalCount: 50,
    currentPage: 1,
    pageSize: 4,
  },
  render: function Render(args) {
    const { currentPage, onPageChange, totalCount, currentRows, pageSize } =
      useTablePagination({
        rows: mockRows,
        pageSize: 4,
      });
    return (
      <Pagination
        {...args}
        {...{ currentPage, onPageChange, currentRows, totalCount, pageSize }}
      />
    );
  },
};

export const WithCustomTotalCount: Story = {
  args: {
    totalCount: 50,
    currentPage: 1,
    pageSize: 4,
  },
  render: function Render(args) {
    const { currentPage, onPageChange, totalCount, currentRows, pageSize } =
      useTablePagination({
        rows: mockRows.slice(0, 10), // only pass the first page of rows
        totalRowCount: 100, // but tell the hook the total is 100
        pageSize: 10,
      });
    return (
      <Pagination
        {...args}
        {...{ currentPage, onPageChange, currentRows, totalCount, pageSize }}
      />
    );
  },
};
