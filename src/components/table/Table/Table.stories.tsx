import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import {
  LabelButton,
  Pagination,
  Table,
  TooltipProvider,
  useBulkSelection,
  useTableHelpers,
  useTablePagination,
} from "../../../index";
import {
  DEMO_COLUMNS,
  DEMO_DATA,
  getRowPropsDefault,
  ROW_PROPS_ACTIONS,
  ROW_PROPS_ACTIONS_2,
  ROW_PROPS_HEADER,
  ROW_PROPS_HEADER_ACTIONS,
} from "../fixtures/data";
import { Columns } from "./Table.types";

const meta = {
  title: "Components/Table",
  component: Table,
  parameters: {
    componentSubtitle:
      "Complex component for displaying data. Renders TableRows which render TableCells.",
    layout: "fullscreen", // Tables often need more space
    design: {
      type: "figma",
      url: "https://www.figma.com/file/B9YbaCM1s3RdIe9kLCLRcu/%F0%9F%92%BB-Web-App-%E2%80%94-Base-Components?type=design&node-id=1114-26139&mode=dev",
    },
  },
  decorators: [
    // Wrap all stories in TooltipProvider as most of them use it
    (Story) => (
      <TooltipProvider>
        <div className="sui-p-4">
          <Story />
        </div>
      </TooltipProvider>
    ),
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    rows: [
      getRowPropsDefault(),
      getRowPropsDefault(),
      getRowPropsDefault(),
      getRowPropsDefault(),
    ],
    headerRow: ROW_PROPS_HEADER,
  },
};

export const WithLoading: Story = {
  args: {
    ...Basic.args,
    rows: [getRowPropsDefault()],
    loading: true,
  },
};

export const WithHelperHook: Story = {
  render: () => {
    const { rows, headerRow } = useTableHelpers({
      data: DEMO_DATA,
      columns: DEMO_COLUMNS,
    });
    return <Table rows={rows} headerRow={headerRow} />;
  },
};

export const Complex: Story = {
  args: {
    rows: [ROW_PROPS_ACTIONS, ROW_PROPS_ACTIONS_2],
    headerRow: ROW_PROPS_HEADER_ACTIONS,
  },
};

const expandingRowsData = [
  { id: 1, name: "Peter Parker", email: "thwipthwip@gmail.com" },
  {
    id: 2,
    name: "Avengers",
    email: "jarvis@stark.com",
    expandedRows: [
      { id: 100, name: "Tony Stark", email: "tony@stark.com" },
      { id: 101, name: "Steve Rogers", email: "cap_tain_america@hotmail.com" },
      { id: 102, name: "Natasha Romanoff", email: "[REDACTED]" },
    ],
  },
  { id: 3, name: "Clark Kent", email: "sooooperman@whoosh.com" },
];

export const WithExpandingRows: Story = {
  render: () => {
    const { rows, headerRow } = useTableHelpers({
      data: expandingRowsData,
      columns: DEMO_COLUMNS,
    });
    return <Table rows={rows} headerRow={headerRow} />;
  },
};

export const BulkSelect: Story = {
  render: (args) => {
    const { rows, headerRow } = useTableHelpers({
      data: DEMO_DATA,
      columns: DEMO_COLUMNS,
    });
    const {
      rows: selectableRows,
      toggleSelectAll,
      allRowsSelected,
    } = useBulkSelection({
      rows,
      onChangeSelected: fn(),
    });
    return (
      <Table
        {...args}
        rows={selectableRows}
        headerRow={headerRow}
        toggleSelectAll={toggleSelectAll}
        allRowsSelected={allRowsSelected}
      />
    );
  },
};

export const BulkSelectWithDisabledRows: Story = {
  render: (args) => {
    const data = [
      { id: 2, name: "Brad", birthdate: "Dec 17, 1990" },
      { id: 1, name: "Aaron", birthdate: "March 17, 1990" },
      { id: 4, name: "Dauzy", birthdate: "Jan 17, 1990" },
      { id: 3, name: "Carl", birthdate: "April 17, 1990" },
      { id: 5, name: "Earl", birthdate: "101" },
    ];
    const columns: Columns = {
      name: { label: "Name", align: "left" },
      birthdate: { label: "Birthdate", align: "left" },
    };
    const { rows, headerRow } = useTableHelpers({ data, columns });
    const {
      rows: selectableRows,
      toggleSelectAll,
      allRowsSelected,
    } = useBulkSelection({
      rows,
      onChangeSelected: fn(),
      isRowSelectable: (row) => row.name !== "Earl",
    });
    return (
      <Table
        {...args}
        rows={selectableRows}
        headerRow={headerRow}
        toggleSelectAll={toggleSelectAll}
        allRowsSelected={allRowsSelected}
      />
    );
  },
};

export const BulkSelectWithColumnManagement: Story = {
  render: (args) => {
    const [activeColumns, setActiveColumns] = useState(["birthdate"]);
    const data = [
      { id: 2, name: "Brad", birthdate: "Dec 17, 1990", gender: "Male" },
      { id: 1, name: "Aaron", birthdate: "March 17, 1990", gender: "Male" },
      { id: 4, name: "Dauzy", birthdate: "Jan 17, 1990", gender: "Male" },
      { id: 3, name: "Carl", birthdate: "April 17, 1990", gender: "Male" },
      { id: 5, name: "Earl", birthdate: "101", gender: "Male" },
    ];
    const buildColumns = (): Columns => {
      const baseColumns: Columns = { name: { label: "Name", align: "left" } };
      if (activeColumns.includes("birthdate")) {
        baseColumns.birthdate = { label: "Birthdate", align: "left" };
      }
      if (activeColumns.includes("gender")) {
        baseColumns.gender = { label: "Gender", align: "left" };
      }
      return baseColumns;
    };
    const { rows, headerRow } = useTableHelpers({
      data,
      columns: buildColumns(),
    });
    const {
      rows: selectableRows,
      toggleSelectAll,
      allRowsSelected,
    } = useBulkSelection({
      rows,
      onChangeSelected: fn(),
    });
    return (
      <>
        <LabelButton
          className="sui-mb-4"
          labelText="Toggle Gender Column"
          onClick={() =>
            setActiveColumns((prev) =>
              prev.includes("gender")
                ? prev.filter((c) => c !== "gender")
                : [...prev, "gender"],
            )
          }
        />
        <Table
          {...args}
          rows={selectableRows}
          headerRow={headerRow}
          toggleSelectAll={toggleSelectAll}
          allRowsSelected={allRowsSelected}
        />
      </>
    );
  },
};

export const WithExpandingSelectableRows: Story = {
  render: () => {
    const { rows, headerRow } = useTableHelpers({
      data: expandingRowsData,
      columns: DEMO_COLUMNS,
    });
    const {
      rows: selectableRows,
      toggleSelectAll,
      allRowsSelected,
    } = useBulkSelection({
      rows,
      onChangeSelected: fn(),
    });
    return (
      <Table
        rows={selectableRows}
        headerRow={headerRow}
        toggleSelectAll={toggleSelectAll}
        allRowsSelected={allRowsSelected}
      />
    );
  },
};

export const WithPagination: Story = {
  render: () => {
    const { currentPage, onPageChange, totalCount, currentRows, pageSize } =
      useTablePagination({
        rows: Array.from({ length: 12 }, () => getRowPropsDefault()),
        pageSize: 4,
      });
    return (
      <>
        <Table headerRow={ROW_PROPS_HEADER} rows={currentRows} />
        <Pagination {...{ currentPage, onPageChange, totalCount, pageSize }} />
      </>
    );
  },
};

export const WithPaginationAndBulkSelect: Story = {
  render: () => {
    const { rows, headerRow } = useTableHelpers({
      data: DEMO_DATA,
      columns: DEMO_COLUMNS,
    });
    const { currentPage, onPageChange, totalCount, currentRows, pageSize } =
      useTablePagination({ rows, pageSize: 2 });
    const {
      rows: selectableRows,
      toggleSelectAll,
      allRowsSelected,
      clearSelected,
    } = useBulkSelection({
      rows: currentRows,
      onChangeSelected: fn(),
    });
    return (
      <>
        <Table
          headerRow={headerRow}
          rows={selectableRows}
          allRowsSelected={allRowsSelected}
          toggleSelectAll={toggleSelectAll}
        />
        <Pagination
          {...{
            currentPage,
            onPageChange: (p: number) => {
              onPageChange(p);
              clearSelected();
            },
            totalCount,
            pageSize,
          }}
        />
      </>
    );
  },
};

export const WithSorting: Story = {
  render: () => {
    const data = [
      { id: 2, name: "Brad", birthdate: "Dec 17, 1990" },
      { id: 1, name: "Aaron", birthdate: "March 17, 1990" },
      { id: 4, name: "Dauzy", birthdate: "Jan 17, 1990" },
      { id: 3, name: "Carl", birthdate: "April 17, 1990" },
      { id: 5, name: "Earl" },
    ];
    const columns: Columns = {
      name: { label: "Name", sort: "alpha", align: "left" },
      birthdate: { label: "Birthdate", sort: "date", align: "left" },
    };
    const { rows, headerRow } = useTableHelpers({
      data,
      columns,
      initialSorting: { method: "alpha", sortKey: "name", acsending: true },
    });
    const {
      rows: selectableRows,
      toggleSelectAll,
      allRowsSelected,
    } = useBulkSelection({
      rows,
      onChangeSelected: fn(),
      isRowSelectable: (row) => row.name !== "Earl",
    });
    return (
      <Table
        allRowsSelected={allRowsSelected}
        toggleSelectAll={toggleSelectAll}
        rows={selectableRows}
        headerRow={headerRow}
      />
    );
  },
};

export const WithTooltip: Story = {
  render: () => {
    const data = [
      { id: 2, name: "Brad", birthdate: "Dec 17, 1990" },
      { id: 1, name: "Aaron", birthdate: "March 17, 1990" },
    ];
    const columns: Columns = {
      name: {
        label: "Name",
        sort: "alpha",
        align: "left",
        headerProps: {
          key: "person-name-header",
          tooltip: "This is the name of the person",
        },
      },
      birthdate: { label: "Birthdate", sort: "date", align: "left" },
    };
    const { rows, headerRow } = useTableHelpers({ data, columns });
    return <Table rows={rows} headerRow={headerRow} />;
  },
};

export const WithAdditionalHeading: Story = {
  render: () => {
    const data = [
      { id: 2, name: "Brad", birthdate: "Dec 17, 1990" },
      { id: 1, name: "Aaron", birthdate: "March 17, 1990" },
    ];
    const columns: Columns = {
      name: {
        label: "Name",
        sort: "alpha",
        align: "left",
        headerProps: {
          key: "name-header",
          height: "tall",
          prepend: "Personal Information",
        },
      },
      birthdate: {
        label: "Birthdate",
        sort: "date",
        align: "right",
        headerProps: {
          key: "birthdate-header",
          height: "tall",
          prepend: <></>,
        },
      },
    };
    const { rows, headerRow } = useTableHelpers({ data, columns });
    return <Table rows={rows} headerRow={headerRow} />;
  },
};

export const WithExternalSorting: Story = {
  name: "With External Sorting",
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates external sorting control via a dropdown menu while maintaining column header sort functionality.",
      },
    },
  },
  render: () => {
    type SortOption = {
      method: "alpha" | "date" | "numeric" | undefined;
      sortKey: string;
      ascending: boolean;
    };
    const [currentSort, setCurrentSort] = useState<SortOption>({
      method: "alpha",
      sortKey: "name",
      ascending: true,
    });
    const columns: Columns = {
      name: { label: "Name", align: "left", sort: "alpha" },
      birthdate: { label: "Birthdate", align: "left", sort: "date" },
      team: { label: "Team", align: "left", sort: "alpha" },
    };
    const data = [
      { id: 2, name: "Brad", birthdate: "Dec 17, 1990", team: "Red Dragons" },
      {
        id: 1,
        name: "Aaron",
        birthdate: "March 17, 1990",
        team: "Blue Eagles",
      },
      { id: 4, name: "Dauzy", birthdate: "Jan 17, 1990", team: "Green Sharks" },
      {
        id: 3,
        name: "Carl",
        birthdate: "April 17, 1990",
        team: "Yellow Lions",
      },
      {
        id: 5,
        name: "Earl",
        birthdate: "May 15, 1992",
        team: "Purple Panthers",
      },
    ];
    const getSortedData = () => {
      const { sortKey, method, ascending } = currentSort;
      return [...data].sort((a, b) => {
        const aValue = (a as Record<string, any>)[sortKey];
        const bValue = (b as Record<string, any>)[sortKey];
        if (!aValue || !bValue) return 0;
        if (method === "alpha") {
          return ascending
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        if (method === "date") {
          return ascending
            ? new Date(aValue).getTime() - new Date(bValue).getTime()
            : new Date(bValue).getTime() - new Date(aValue).getTime();
        }
        return 0;
      });
    };
    const { rows, headerRow } = useTableHelpers({
      data: getSortedData(),
      columns,
      initialSorting: {
        sortKey: currentSort.sortKey,
        method: currentSort.method ?? "alpha",
        acsending: currentSort.ascending,
      },
      onSort: (sortKey, ascending) => {
        setCurrentSort({ method: columns[sortKey].sort, sortKey, ascending });
      },
    });
    return <Table rows={rows} headerRow={headerRow} />;
  },
};

export const WithStickyColumn: Story = {
  render: () => {
    const columns = {
      name: { label: "Name", width: "200px" },
      birthdate: { label: "Birthdate", width: "200px" },
      team: { label: "Team", width: "200px" },
      age: { label: "Age", width: "200px" },
      status: { label: "Status", width: "200px" },
      favoriteColor: { label: "Favorite Color", width: "200px" },
      lastUpdated: { label: "Last Updated", width: "200px" },
      actions: { ...DEMO_COLUMNS.actions },
    };
    const data = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      name: `Person ${i + 1}`,
      birthdate: "Dec 17, 1990",
      team: "Red Dragons",
      age: 33,
      status: "Active",
      favoriteColor: "Red",
      lastUpdated: "2021-10-01T00:00:00.000Z",
    }));
    const { rows, headerRow } = useTableHelpers({ data, columns });
    return (
      <div style={{ overflowX: "auto", width: "100%" }}>
        <Table rows={rows} headerRow={headerRow} stickyLastColumn />
      </div>
    );
  },
};
