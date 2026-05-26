import { TableCellProps } from '../TableCell/TableCell.types';

/**
 * NOTE: Update TableRow.test.tsx with all additions and changes!
 */
export type TableRowProps = {
  __id: string;
  /**
   * row will loop over the array of cells and render them, see the TableCell component for more info
   * This info is meant to be generated from the 'columns' config used with the Table component
   */
  cells?: TableCellProps[];
  /**
   * in some use cases, the row will be expanded to show more info, this is the data for the expanded row. it be an array of arrays following the same format as the cells prop.
   * The TableRow will handle the open/collapsed state of the row, but the parent Table component will need to pass in the expandedRows prop to the TableRow (not yet imlpemented in the useTableHelpers hook)
   */
  expandedRows?: TableCellProps[][];
  /**
   * The following props are meant to be passed in from the parent Table component
   */
  selected?: boolean;
  toggleSelected?: (event: React.ChangeEvent) => void;
  /**
   * Aside from header rows, determines if the row select checkbox is disabled
   */
  isSelectDisabled?: boolean;
  alternateBackground?: boolean;
  expands?: boolean;
  /**
   * Children will override the cells prop, and will be rendered instead of the cells, just in case you need to render something custom. (ex: a banner add in the middle of the table list?)
   */
  children?: React.ReactNode;
  loading?: boolean;
  /**
   * Allows the right-most column in the table to be sticky, so always visible.
   */
  stickyLastColumn?: boolean;
  /**
   * Any other props to pass along (comment this out when running tests to catch prop errors)
   */
  [x: string]: any;
};
