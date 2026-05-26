import "@testing-library/jest-dom";
import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { getRowPropsDefault, ROW_PROPS_HEADER } from "../fixtures/data";
import { useBulkSelection, useTableHelpers } from "./hooks";
import Table from "./Table";
import { TableProps } from "./Table.types";

const onChangeSelected = jest.fn();
const isRowSelectable = jest.fn();

const selectTableData = [
  { text: "Cell 1", "text-link": "Label1", status: "Failed" },
  { text: "Cell 2", "text-link": "Label2", status: "Success" },
  { text: "Cell 3", "text-link": "Label3", status: "Pending" },
];

const SelectableTable = (props: any) => {
  const { rows, headerRow } = useTableHelpers({
    data: selectTableData,
    columns: {
      text: {
        label: "Text",
      },
      "text-link": {
        label: "Text Link",
      },
      status: {
        label: "Status",
      },
    },
  });
  const {
    rows: selectableRows,
    toggleSelectAll,
    allRowsSelected,
    clearSelected,
  } = useBulkSelection({
    rows,
    onChangeSelected,
    isRowSelectable,
    ...props,
  });
  return (
    <Table
      rows={selectableRows}
      headerRow={headerRow}
      allRowsSelected={allRowsSelected}
      toggleSelectAll={toggleSelectAll}
    />
  );
};

describe("Table", () => {
  let idCounter = 0;
  const mockUUID = "mock-uuid";
  const getMockId = () => {
    idCounter += 1;
    return `${mockUUID}-${idCounter}`;
  };

  beforeAll(() => {
    Object.defineProperty(self, "crypto", {
      value: {
        randomUUID: jest.fn(() => getMockId()),
      },
      writable: true,
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    idCounter = 0;
    onChangeSelected.mockClear();
    isRowSelectable.mockClear();
  });

  let props: TableProps;

  it("should show loading skeleton when loading", () => {
    props = {
      rows: [getRowPropsDefault(), getRowPropsDefault(), getRowPropsDefault()],
      headerRow: ROW_PROPS_HEADER,
      loading: true,
    };
    render(<Table {...props} />);
    const Table_component = screen.getByTestId("table-component");
    expect(Table_component).toBeInTheDocument();
    expect(
      screen.getAllByTestId("TableCell-LoadingSkeleton").length,
    ).toBeGreaterThan(0);
  });

  it("should display rows", () => {
    props = {
      rows: [getRowPropsDefault(), getRowPropsDefault(), getRowPropsDefault()],
      headerRow: ROW_PROPS_HEADER,
    };
    const { getByTestId, getAllByTestId } = render(<Table {...props} />);
    const Table_component = getByTestId("table-component");
    const rows = getAllByTestId("table-row-component");
    expect(Table_component).toBeInTheDocument();
    expect(rows.length).toBe(4);
  });

  /**
   * WARNING: Changing options for or deleting existing props can be a breaking
   * change! Make breaking changes clear in commit notes and version numbers!
   */
  it("should allow all expected props", () => {
    // List all required props
    let propTest: TableProps = {
      children: "",
    };
    // List all remaining options for required props and optional props
  });

  it("calls isRowSelectable for each row", () => {
    render(<SelectableTable />);
    expect(isRowSelectable).toHaveBeenCalledTimes(3);
  });

  it("disables the correct rows when isRowSelectable is provided", () => {
    const isRowSelectable = (row: any) => {
      return row.text !== "Cell 2";
    };

    render(<SelectableTable isRowSelectable={isRowSelectable} />);
    const checkboxes = screen.getAllByRole("checkbox");

    // The 0th checkbox is the select All checkbox
    expect(checkboxes[1]).not.toBeDisabled();
    expect(checkboxes[2]).toBeDisabled();
    expect(checkboxes[3]).not.toBeDisabled();
  });

  it("calls onChangeSelected when a row is selected", async () => {
    render(<SelectableTable isRowSelectable={() => true} />);
    const checkboxes = screen.getAllByRole("checkbox");

    fireEvent.click(checkboxes[1]);
    expect(onChangeSelected).toHaveBeenCalled();

    // Check that the last call has the correct data
    const lastCall =
      onChangeSelected.mock.calls[onChangeSelected.mock.calls.length - 1];
    expect(lastCall[0]).toEqual([
      expect.objectContaining({
        text: "Cell 1",
        "text-link": "Label1",
        status: "Failed",
      }),
    ]);

    // Deselect the checkbox to ensure that the row is removed from the selected rows
    fireEvent.click(screen.getAllByRole("checkbox")[1]);

    // Check that the final call results in empty selection
    const finalCall =
      onChangeSelected.mock.calls[onChangeSelected.mock.calls.length - 1];
    expect(finalCall[0]).toEqual([]);
  });

  it("calls onChangeSelected when Select All checkbox is selected", async () => {
    render(<SelectableTable isRowSelectable={() => true} />);
    const checkboxes = screen.getAllByRole("checkbox");

    fireEvent.click(checkboxes[0]);
    await waitFor(() => {
      expect(onChangeSelected).toHaveBeenCalled();

      // Check the last call has all the data
      const lastCall =
        onChangeSelected.mock.calls[onChangeSelected.mock.calls.length - 1];
      for (let i = 0; i < selectTableData.length; i++) {
        expect(lastCall[0][i]).toEqual(
          expect.objectContaining(selectTableData[i]),
        );
      }
    });
  });

  it("does not select disabled rows when Select All checkbox is selected", () => {
    const isRowSelectable = (row: any) => {
      return row.text !== "Cell 2";
    };

    render(<SelectableTable isRowSelectable={isRowSelectable} />);
    const checkboxes = screen.getAllByRole("checkbox");

    fireEvent.click(checkboxes[0]);

    // Updated expectation: onChangeSelected gets called multiple times
    expect(onChangeSelected).toHaveBeenCalled();

    // Check the last call has the correct data (excluding disabled row)
    const lastCall =
      onChangeSelected.mock.calls[onChangeSelected.mock.calls.length - 1];
    expect(lastCall[0]).toEqual([
      expect.objectContaining({
        text: "Cell 1",
        "text-link": "Label1",
        status: "Failed",
      }),
      expect.objectContaining({
        text: "Cell 3",
        "text-link": "Label3",
        status: "Pending",
      }),
    ]);
  });
});
