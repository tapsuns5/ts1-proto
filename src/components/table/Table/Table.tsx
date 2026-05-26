import React from "react";
import TableRow from "../TableRow/TableRow";
import classes from "./Table.module.scss";
import { TableProps } from "./Table.types";

/**
 * The table component takes a list of rows that are either passed in manually
 * or generated from the useTableHelpers hook. The rows are of type TableRowProps.
 * To keep track of which row is which, the component adds an internal __id to each row.
 */
const Table: React.FC<TableProps> = ({
  rows,
  headerRow,
  toggleSelectAll,
  allRowsSelected,
  loading,
  children,
  className = "",
  stripes,
  emptyLabel = "No data found",
  stickyLastColumn = false,
  ...props
}) => {
  // if any row has expandedRows, then every row needs to know to add the spacer cell
  const expands = rows?.some((row) => !!row.expandedRows);
  const renderHeader = () => {
    if (headerRow) {
      const rowProps = { ...headerRow, expands };
      if (toggleSelectAll) {
        rowProps.toggleSelected = toggleSelectAll;
        const disabledRows = rows?.filter((row) => row.isSelectDisabled);
        rowProps.selected =
          allRowsSelected &&
          disabledRows?.length !== (rows?.length ?? 0) &&
          (rows?.length ?? 0) > 0;
      }
      return (
        <TableRow
          stickyLastColumn={stickyLastColumn}
          key={`snap-ui-table-row-header`}
          // @ts-expect-error // check if we can remove this
          expands={expands}
          loading={loading}
          {...rowProps}
          header
        />
      );
    }
    return null;
  };

  const renderRows = () => {
    if (!rows) return null;
    if (rows.length === 0)
      return (
        <div className="sui-mx-auto sui-p-4 sui-text-center sui-text-desktop-4 sui-text-neutral-text-weak">
          {emptyLabel}
        </div>
      );
    return rows.map((row, index) => {
      const rowProps = { ...row, expands };
      const { __id } = row;
      return (
        <TableRow
          key={`snap-ui-table-row-${__id}`}
          // @ts-expect-error // check if we can remove this
          expands={expands}
          stickyLastColumn={stickyLastColumn}
          loading={loading}
          alternateBackground={stripes && index % 2 !== 0}
          {...rowProps}
        />
      );
    });
  };

  return (
    <div
      data-testid="table-component"
      className={[classes["table"], className].join(" ")}
      {...props}>
      {!!children ? (
        children
      ) : (
        <>
          {renderHeader()}
          {renderRows()}
        </>
      )}
    </div>
  );
};

export default Table;
