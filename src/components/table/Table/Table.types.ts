import React from 'react';
import { TableCellProps } from '../TableCell/TableCell.types';
import { TableRowProps } from '../TableRow/TableRow.types';

/**
 * NOTE: Update Table.test.tsx with all additions and changes!
 */
export type TableProps = {
  rows?: TableRowProps[];
  headerRow?: TableRowProps;
  /**
   * If provided, renders selectable checkboxes in the first column and provides bulk selection.
   * This value is a set of the internal row IDs.
   * @see useBulkSelection
   */
  selectedRows?: Set<string>;
  /**
   * Takes a list of internal row IDs and updates the selectedRows state.
   */
  toggleSelectAll?: () => void;
  allRowsSelected?: boolean;
  /**
   * A set of internal row IDs that should have the selectable checkbox disabled.
   */
  disabledRows?: Set<string>;
  /**
   * Children override the rows generated from data
   */
  children?: React.ReactNode;
  /**
   * Boolean to add alternate background colors
   */
  stripes?: boolean;
  /**
   * ReactNode to display when no data is found, default is 'No data found'
   */
  emptyLabel?: React.ReactNode;
  className?: string;
  loading?: boolean;
  /**
   * Allows the right-most column in the table to be sticky, so always visible.
   */
  stickyLastColumn?: boolean;
  /**
   * Any other props to pass along (comment this out when running tests to catch prop errors)
   */
  //   [x: string]: any;
};

export type Columns = {
  /**
   * The key of the column is used for sorting and filtering
   */
  [x: string]: {
    /**
     * The label to display in the header
     */
    label: string;
    /**
     * The width of the column
     */
    width?: string;
    /**
     * The alignment of the column
     */
    align?: 'left' | 'center' | 'right';
    /**
     * sorting options - TODO: custom methods
     */
    sort?: 'alpha' | 'date' | 'numeric';
    /**
     * Extra classes to add to the cells in this column
     */
    headerProps?: TableCellProps & {
      prepend?: React.ReactNode;
      tooltip?: string | React.ReactNode;
    };
    getBodyProps?: (data: Record<string, any>) => TableCellProps;
  };
};

export type BulkSelectionArgs = {
  rows: TableRowProps[];
  /**
   * Function that gets called if the selected rows change
   * @param selectedRows The indices of the selected rows
   */
  onChangeSelected: (selectedRows: Record<string, any>[]) => void;
  /**
   * Function to query the caller if a row is selectable
   * @param row The row data
   * @returns A boolean to determine if the row is selectable or not
   */
  isRowSelectable?: (row: Record<string, any>) => boolean;
};
