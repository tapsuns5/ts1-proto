import { act } from "react";
import { renderHook } from "@testing-library/react";
import * as uuid from "uuid";
import { DEMO_COLUMNS, DEMO_DATA, getRowPropsDefault } from "../fixtures/data";
import { useBulkSelection, useTableHelpers, useTablePagination } from "./hooks";

jest.mock("uuid");

describe("useTablePagination", () => {
  test("should return the correct page data", () => {
    const { result } = renderHook(useTablePagination, {
      initialProps: {
        rows: [
          getRowPropsDefault(),
          getRowPropsDefault(),
          getRowPropsDefault(),
          getRowPropsDefault(),
        ],
        pageSize: 2,
      },
    });
    expect(result.current.currentPage).toEqual(1);
    expect(result.current.pageSize).toEqual(2);
    expect(result.current.totalCount).toEqual(4);
    expect(result.current.currentRows.length).toEqual(2);
  });
  test("should return same if only one page", () => {
    const { result } = renderHook(useTablePagination, {
      initialProps: {
        rows: [getRowPropsDefault(), getRowPropsDefault()],
        pageSize: 50,
      },
    });
    expect(result.current.currentPage).toEqual(1);
    expect(result.current.pageSize).toEqual(50);
    expect(result.current.totalCount).toEqual(2);
    expect(result.current.currentRows).toEqual([
      getRowPropsDefault(),
      getRowPropsDefault(),
    ]);
  });

  test("should return the custom total count if provided", () => {
    const { result } = renderHook(useTablePagination, {
      initialProps: {
        rows: [
          getRowPropsDefault(),
          getRowPropsDefault(),
          getRowPropsDefault(),
          getRowPropsDefault(),
        ],
        pageSize: 2,
        totalRowCount: 10,
      },
    });
    expect(result.current.currentPage).toEqual(1);
    expect(result.current.pageSize).toEqual(2);
    expect(result.current.totalCount).toEqual(10);
    expect(result.current.currentRows.length).toEqual(2);
  });
});

describe("useTableHelpers", () => {
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
  });

  test("should return the rows and header", () => {
    const { result } = renderHook(useTableHelpers, {
      initialProps: {
        data: DEMO_DATA,
        columns: DEMO_COLUMNS,
      },
    });
    expect(result.current.rows.length).toEqual(3);
    expect(result.current.headerRow.cells).toBeDefined();
    expect(result.current.headerRow.cells?.[0].text).toEqual("ID");
    expect(result.current.headerRow.cells?.[1].text).toEqual("Name");
    expect(result.current.headerRow.cells?.[2].text).toEqual("Email");
    expect(result.current.rows[0].cells?.[0].text).toEqual(DEMO_DATA[0].id);
    expect(result.current.rows[0].cells?.[1].text).toEqual(DEMO_DATA[0].name);
    expect(result.current.rows[0].cells?.[2].text).toEqual(DEMO_DATA[0].email);
  });

  test("should assign a UUID to rows without an ID", () => {
    const dataWithoutId = [{ name: "Test Name", email: "test@example.com" }];
    const { result } = renderHook(useTableHelpers, {
      initialProps: {
        data: dataWithoutId,
        columns: DEMO_COLUMNS,
      },
    });
    expect(result.current.rows[0].__id).toBe(`${mockUUID}-1`);
  });

  test("should return expanded table cells if provided", () => {
    const data = [...DEMO_DATA];
    data[1].expandedRows = [
      {
        id: "10",
        name: "Harry Potter",
        email: "harryPotter@gmail.com",
      },
      {
        id: "11",
        name: "Ron Weasley",
        email: "ron_and_scabbers@yahoo.com",
      },
    ];
    const { result } = renderHook(useTableHelpers, {
      initialProps: {
        data,
        columns: DEMO_COLUMNS,
      },
    });
    const { rows, headerRow } = result.current;
    expect(headerRow.cells?.[0].text).toEqual("ID");
    expect(headerRow.cells?.[1].text).toEqual("Name");
    expect(headerRow.cells?.[2].text).toEqual("Email");
    // Total length of rows should still be 3
    expect(rows.length).toEqual(3);
    // Nothing should change for the first row
    expect(rows[0].cells?.[0].text).toEqual(DEMO_DATA[0].id);
    expect(rows[0].cells?.[1].text).toEqual(DEMO_DATA[0].name);
    expect(rows[0].cells?.[2].text).toEqual(DEMO_DATA[0].email);
    // Second row should be intact
    expect(rows[1].cells?.[0].text).toEqual(DEMO_DATA[1].id);
    expect(rows[1].cells?.[1].text).toEqual(DEMO_DATA[1].name);
    expect(rows[1].cells?.[2].text).toEqual(DEMO_DATA[1].email);
    // Should have expanded rows for the second outer row
    // Expanded row 1
    expect(rows[1].expandedRows?.[0]?.[0]?.text).toEqual("10");
    expect(rows[1].expandedRows?.[0][1].text).toEqual("Harry Potter");
    expect(rows[1].expandedRows?.[0][2].text).toEqual("harryPotter@gmail.com");

    // Expanded row 2
    expect(rows[1].expandedRows?.[1][0].text).toEqual("11");
    expect(rows[1].expandedRows?.[1][1].text).toEqual("Ron Weasley");
    expect(rows[1].expandedRows?.[1][2].text).toEqual(
      "ron_and_scabbers@yahoo.com",
    );

    // Third row should be intact
    expect(rows[2].cells?.[0].text).toEqual(DEMO_DATA[2].id);
    expect(rows[2].cells?.[1].text).toEqual(DEMO_DATA[2].name);
    expect(rows[2].cells?.[2].text).toEqual(DEMO_DATA[2].email);
  });

  test("should call onSort method if provided", () => {
    const onSort = jest.fn();
    const { result } = renderHook(useTableHelpers, {
      initialProps: {
        data: DEMO_DATA,
        columns: DEMO_COLUMNS,
        onSort,
      },
    });
    const { headerRow } = result.current;
    act(() => {
      if (headerRow.cells && headerRow.cells[0] && headerRow.cells[0].onSort) {
        headerRow.cells[0].onSort();
      }
    });
    expect(onSort).toHaveBeenCalledTimes(1);
    expect(onSort).toHaveBeenCalledWith("id", true);
  });

  it("should perfom sorting on the table if sorting provided", () => {
    const { result } = renderHook(useTableHelpers, {
      initialProps: {
        data: DEMO_DATA,
        columns: DEMO_COLUMNS,
        sortKey: "name",
        sortAscending: true,
        sortMethod: "alpha",
      },
    });
    const { rows } = result.current;
    expect(rows[0].cells?.[0].text).toEqual("2");
    expect(rows[1].cells?.[0].text).toEqual("1");
    expect(rows[2].cells?.[0].text).toEqual("3");
  });

  it("should error if sortKey provided without sortMethod", () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    renderHook(useTableHelpers, {
      initialProps: {
        data: DEMO_DATA,
        columns: DEMO_COLUMNS,
        sortKey: "name",
      },
    });
    expect(errorSpy).toHaveBeenCalledTimes(1);
    errorSpy.mockRestore();
  });
});

describe("useBulkSelection", () => {
  const ids = ["1", "2", "3", "4"];
  let index = 0;
  const onChangeSelected = jest.fn();
  const isRowSelectable = jest.fn(() => true);

  const uuidSpy = jest.spyOn(uuid, "v4");

  beforeEach(() => {
    index = 0;
    uuidSpy.mockClear();
    onChangeSelected.mockClear();
    isRowSelectable.mockClear();
    (uuid.v4 as jest.Mock).mockImplementation(() => {
      const id = ids[index];
      index += 1;
      return id;
    });
  });

  test("should return defaults", () => {
    const { result } = renderHook(useBulkSelection, {
      initialProps: {
        rows: [
          getRowPropsDefault(),
          getRowPropsDefault(),
          getRowPropsDefault(),
          getRowPropsDefault(),
        ],
        onChangeSelected,
        isRowSelectable,
      },
    });
    const { current } = result;
    const { rows, toggleSelectAll, allRowsSelected, clearSelected } = current;
    expect(rows.length).toEqual(4);
    expect(onChangeSelected).toHaveBeenCalledTimes(1);
    expect(onChangeSelected).toHaveBeenCalledWith([]); // Called with empty array initially
    expect(toggleSelectAll).toBeDefined();
    expect(allRowsSelected).toBeFalsy();
    expect(clearSelected).toBeDefined();
    expect(isRowSelectable).toHaveBeenCalledTimes(4);
  });

  test("should toggle selected rows", () => {
    const { result, rerender } = renderHook(useBulkSelection, {
      initialProps: {
        rows: [
          getRowPropsDefault(),
          getRowPropsDefault(),
          getRowPropsDefault(),
          getRowPropsDefault(),
        ],
        onChangeSelected,
        isRowSelectable,
      },
    });

    act(() => {
      result.current.toggleSelectAll();
    });
    for (let i = 0; i < 4; i += 1) {
      expect(result.current.rows[i]).toEqual(
        expect.objectContaining({ selected: true }),
      );
    }

    act(() => {
      result.current.toggleSelectAll();
    });
    for (let i = 0; i < 4; i += 1) {
      expect(result.current.rows[i]).toEqual(
        expect.objectContaining({ selected: false }),
      );
    }
  });

  test("should clear selected rows", () => {
    const { result } = renderHook(useBulkSelection, {
      initialProps: {
        rows: [
          getRowPropsDefault(),
          getRowPropsDefault(),
          getRowPropsDefault(),
          getRowPropsDefault(),
        ],
        onChangeSelected,
        isRowSelectable,
      },
    });

    act(() => {
      result.current.toggleSelectAll();
    });

    expect(result.current.allRowsSelected).toBeTruthy();

    act(() => {
      result.current.clearSelected();
    });

    for (let i = 0; i < 4; i += 1) {
      expect(result.current.rows[i]).toEqual(
        expect.objectContaining({ selected: false }),
      );
    }
    expect(result.current.allRowsSelected).toBeFalsy();
  });

  test("should store disabled rows", () => {
    const { result } = renderHook(useBulkSelection, {
      initialProps: {
        rows: [
          { ...getRowPropsDefault(), __data: { key: "hello", text: "world" } },
          {
            cells: [
              ...(getRowPropsDefault().cells ?? []),
              { key: "text", text: "Disabled Row" },
            ],
            __data: { key: "text", text: "Disabled Row" },
            __id: "rando",
          },
          { ...getRowPropsDefault(), __data: { key: "foo", text: "bar" } },
        ],
        onChangeSelected,
        isRowSelectable: (row) => row.text !== "Disabled Row",
      },
    });
    const { rows } = result.current;
    expect(rows[0].isSelectDisabled).toBeFalsy();
    expect(rows[1].isSelectDisabled).toBeTruthy();
    expect(rows[2].isSelectDisabled).toBeFalsy();
  });
});
