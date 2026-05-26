import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TableCellProps, TableCellType } from "../TableCell/TableCell.types";
import { TableRowProps } from "../TableRow/TableRow.types";
import { BulkSelectionArgs, Columns } from "./Table.types";

// Internal type to store an ID for each row so the Table can keep track of them.
type InternalRowProps = TableRowProps & {
  __id: string;
  expandedRows?: Record<string, any>[];
};

export const useTablePagination = ({
  rows,
  totalRowCount,
  pageSize = 10,
}: {
  rows: any[];
  pageSize?: number;
  totalRowCount?: number;
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    const totalPages = Math.ceil((totalRowCount ?? rows.length) / pageSize);
    if (currentPage > totalPages) {
      setCurrentPage(1); // Reset to page 1 if currentPage exceeds total pages
    }
  }, [rows, totalRowCount, pageSize, currentPage]);

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginationProps = useMemo(() => {
    const currentRows = rows.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize,
    );
    return {
      currentRows,
      currentPage,
      onPageChange,
      totalCount: totalRowCount !== undefined ? totalRowCount : rows.length,
      pageSize,
    };
  }, [rows, currentPage, pageSize, totalRowCount]);

  return paginationProps;
};

export const useTableSorting = ({}: {}) => {
  // TODO: implement sorting
};

export const useTableFiltering = ({}: {}) => {
  // TODO: implement filtering
};

export type Sorting = {
  method: string;
  sortKey: string;
  acsending: boolean;
};

interface TableHelpersArgs {
  data: Record<string, any>[];
  columns: Columns;
  initialSorting?: Sorting;
  // Implements frontend sorting, if provided
  sortKey?: string;
  sortMethod?: "alpha" | "date" | "numeric";
  sortAscending?: boolean;
  // Implements manual sorting, if provided
  onSort?: (sortKey: string, ascending: boolean) => void;
}

function mapRowsToCells(
  columns: Columns,
  row: Record<string, any>,
): TableCellProps[] {
  return Object.entries(columns).map(([key, column]) => {
    const cellProps = column.getBodyProps
      ? column.getBodyProps(row)
      : {
          type: TableCellType.Text,
          text: `${row[key]}`,
        };
    return {
      key,
      width: column.width,
      align: column.align,
      ...cellProps,
    };
  });
}

function sortRowData(
  a: InternalRowProps,
  b: InternalRowProps,
  sorting: Sorting,
): number {
  const { sortKey: currentSortKey, acsending } = sorting || {};
  if (!currentSortKey) return 0;
  const asc = acsending ? 1 : -1;

  const isAUndefined =
    a[currentSortKey] === undefined ||
    a[currentSortKey] === null ||
    a[currentSortKey] === "";
  const isBUndefined =
    b[currentSortKey] === undefined ||
    b[currentSortKey] === null ||
    b[currentSortKey] === "";

  if (isAUndefined && isBUndefined) return 0;

  if (isAUndefined || isBUndefined) {
    if (isAUndefined) {
      return asc;
    }
    if (isBUndefined) {
      return -1 * asc;
    }
  }

  const aValue = a[currentSortKey];
  const bValue = b[currentSortKey];

  if (sorting.method === "alpha") {
    return aValue.localeCompare(bValue) * asc;
  }

  if (sorting.method === "date") {
    return (new Date(aValue).getTime() - new Date(bValue).getTime()) * asc;
  }

  return (aValue - bValue) * asc;
}

export const useTableHelpers = ({
  data,
  columns,
  initialSorting,
  sortKey,
  sortMethod,
  sortAscending,
  onSort,
}: TableHelpersArgs): {
  rows: TableRowProps[];
  headerRow: TableRowProps;
  sort?: string;
} => {
  const [sorting, setSorting] = useState<Sorting | null>(null);
  const { sortKey: currentSortKey, acsending } = sorting || {};
  const [rowData, setRowData] = useState<InternalRowProps[]>([]);
  const initialSortingSet = useRef(false);

  // Validate sorting inputs
  useEffect(() => {
    if (initialSortingSet.current) {
      return;
    }
    let sortingProps: Sorting = initialSorting || {
      method: "alpha",
      sortKey: "",
      acsending: true,
    };
    if (onSort) {
      if (sortKey || sortMethod || sortAscending) {
        console.error(
          "onSort provided with sorting props. Please use either onSort or sortKey, sortMethod, and sortAscending",
        );
        return;
      }
    } else if (sortKey && !sortMethod) {
      // Log an error if the sorting props provided are invalid
      console.error("sortKey provided without sortMethod");
      return;
    } else {
      sortingProps = initialSorting
        ? initialSorting
        : {
            method: sortMethod ?? "alpha",
            sortKey: sortKey ?? "",
            acsending: sortAscending ?? true,
          };
    }
    initialSortingSet.current = true;
    setSorting(sortingProps);
  }, [sortKey, sortMethod, sortAscending, onSort]);

  useEffect(() => {
    if (!data.length) {
      setRowData([]);
      return;
    }

    const rowDataObject = data.map((row) => ({
      ...row,
      __id: row.__id ? row.__id : self.crypto.randomUUID(),
    }));
    setRowData(rowDataObject);
  }, [JSON.stringify(data)]);

  const rows = useMemo(() => {
    if (!rowData.length) {
      return [];
    }
    let sortedData: InternalRowProps[] = [];
    if (onSort) {
      // Assume data is already sorted or doesn't need to be sorted
      sortedData = [...rowData];
    } else if (sorting) {
      // Sort data, if FE sorting props are provided
      sortedData = [...rowData].sort((a, b) => sortRowData(a, b, sorting));
    } else {
      sortedData = [...rowData];
    }
    // Map row data to Internal Table cell data
    return sortedData.map((row) => {
      const { __id } = row;
      const tableRow: Partial<TableRowProps> = {
        cells: mapRowsToCells(columns, row),
      };
      if (row.expandedRows) {
        tableRow.expandedRows = row.expandedRows.map((expandedRow) => {
          return mapRowsToCells(columns, expandedRow);
        });
      }
      return { ...tableRow, __id, __data: row };
    });
  }, [sorting, rowData, onSort, columns]);

  const headerRow: TableRowProps = useMemo(() => {
    return {
      __id: "header",
      cells: Object.entries(columns).map(([key, column]) => {
        const cellProps = column.headerProps || {};
        let sortProps = {};

        // Manually add sorting to the header cell if onSort is provided
        if (onSort) {
          sortProps = {
            sort: currentSortKey === key ? "alpha" : undefined,
            onSort: () => {
              let asc: boolean;
              if (!currentSortKey) {
                asc = true;
              } else if (currentSortKey === key) {
                asc = !acsending;
              } else {
                asc = !!acsending;
              }
              onSort(key, asc);
              // @ts-expect-error
              setSorting(({ sortKey: prevKey, acsending }) => ({
                method: column.sort,
                sortKey: key,
                acsending: prevKey === key ? !acsending : !!acsending,
              }));
            },
            ascending: acsending && currentSortKey === key,
          };
        } else if (column.sort) {
          sortProps = {
            sort: currentSortKey === key ? column.sort : undefined,
            onSort: () =>
              // @ts-expect-error
              setSorting(({ sortKey: prevKey, acsending }) => ({
                method: column.sort,
                sortKey: key,
                acsending: prevKey === key ? !acsending : !!acsending,
              })),
            ascending: acsending && currentSortKey === key,
          };
        }
        return {
          key,
          type: column.headerProps?.type || TableCellType.Header,
          width: column.width,
          align: column.align,
          text: column.label,
          ...sortProps,
          ...cellProps,
        };
      }),
    };
  }, [columns, currentSortKey, onSort, sorting]);

  return {
    rows,
    headerRow,
    sort: sorting?.method,
  };
};

export const useBulkSelection = ({
  rows,
  isRowSelectable,
  onChangeSelected,
}: BulkSelectionArgs): {
  rows: TableRowProps[];
  toggleSelectAll: () => void;
  allRowsSelected: boolean;
  clearSelected: () => void;
} => {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  // Storing the rows with their internal IDs as the key for constant time lookup
  const [rowData, setRowData] = useState<Record<string, InternalRowProps>>({});
  // Keep track of the IDs of each disabled row
  const [disabledRows, setDisabledRows] = useState<Set<string>>(new Set());

  const hasMounted = useRef(false);

  const rowKeys = useMemo(() => {
    return JSON.stringify({
      ids: rows.map((row) => row.__id),
      cells: rows.map((row) => row.cells?.map((cell) => cell.key)),
    });
  }, [rows]);

  // Add internal IDs to the rows if they don't have them already.
  useEffect(() => {
    if (!rows.length) {
      setRowData({});
      setSelectedRows(new Set());
      return;
    }
    const rowDataObject = rows.reduce(
      (acc, row) => {
        acc[row.__id] = { ...row };
        return acc;
      },
      {} as Record<string, InternalRowProps>,
    );

    setSelectedRows((prev) => {
      const validIds = new Set(Object.keys(rowDataObject));
      const filteredSelection = new Set(
        Array.from(prev).filter((id) => validIds.has(id)),
      );
      return filteredSelection;
    });

    if (isRowSelectable) {
      // Store which rows are disabled based on ID
      setDisabledRows(
        new Set(
          Object.keys(rowDataObject).filter(
            (id) => !isRowSelectable(rowDataObject[id].__data),
          ),
        ),
      );
    }
    setRowData(rowDataObject);
  }, [rowKeys, isRowSelectable]);

  // If the selected rows change, call the onChangeSelected function with the selected rows.
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    if (onChangeSelected) {
      const validSelectedData = Array.from(selectedRows)
        .filter((id) => rowData[id] && rowData[id].__data)
        .map((id) => rowData[id].__data);

      onChangeSelected(validSelectedData);
    }
  }, [selectedRows, rowData, onChangeSelected]);

  const allRowsSelected = useMemo(() => {
    if (!rows || rows.length === 0) return false;
    return (
      selectedRows.size === Object.keys(rowData).length - disabledRows.size
    );
  }, [selectedRows, rowData, disabledRows]);

  const toggleSelectAll = useCallback(() => {
    if (allRowsSelected) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(
        new Set(Object.keys(rowData).filter((id) => !disabledRows.has(id))),
      );
    }
  }, [allRowsSelected, rowData, disabledRows]);

  const selectableRows = useMemo(() => {
    return rows.map((row) => {
      const { __id } = row;
      const selected = selectedRows.has(__id);
      const isSelectDisabled = disabledRows.has(__id);
      const toggleSelected = selected
        ? () =>
            setSelectedRows((prev) => {
              const newSet = new Set(prev);
              newSet.delete(__id);
              return newSet;
            })
        : () =>
            setSelectedRows((prev) => {
              const newSet = new Set(prev);
              newSet.add(__id);
              return newSet;
            });
      return {
        ...row,
        selected,
        toggleSelected: isSelectDisabled ? () => {} : toggleSelected,
        isSelectDisabled,
      };
    });
  }, [rowKeys, selectedRows, disabledRows]);

  return {
    rows: selectableRows,
    clearSelected: () => setSelectedRows(new Set()),
    allRowsSelected,
    toggleSelectAll,
  };
};
