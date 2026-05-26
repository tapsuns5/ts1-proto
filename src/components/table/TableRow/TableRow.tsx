import React from 'react';
import { cn } from '../../../utils';
import TableCell from '../TableCell/TableCell';
import { TableCellType } from '../TableCell/TableCell.types';
import classes from './TableRow.module.scss';
import { TableRowProps } from './TableRow.types';

/**
 * You likely won't be using the TableRow component directly, but instead use the useTableHelpers hook to generate rows from your data.
  - The TableRow is responsible for adding checkboxes, expandable rows, and alternate background colors.
    - These options are passed in from the Table component.
  */
const TableRow: React.FC<TableRowProps> = ({
  expands = false,
  header = false,
  selected = false,
  loading,
  toggleSelected,
  children,
  cells,
  expandedRows,
  alternateBackground,
  className = '',
  isSelectDisabled,
  stickyLastColumn = false,
  ...props
}) => {
  // The first cell is a toggle for the expanded content
  const [expanded, setExpanded] = React.useState(false);
  const ExpandToggleCell = () => (
    <TableCell
      loading={loading}
      key='expand-toggle-cell'
      type={TableCellType.Accordian}
      onClick={() => setExpanded(!expanded)}
      expanded={expanded}
    />
  );

  const SelectCell = () => (
    <TableCell
      loading={loading}
      key='select-cell'
      type={header ? TableCellType.CheckboxHeader : TableCellType.Checkbox}
      checkbox={{
        extraProps: {
          input: {
            checked: selected,
            onChange: toggleSelected,
            readOnly: true,
            disabled: isSelectDisabled,
          },
        },
      }}
    />
  );
  const renderContent = () => {
    if (children) return children;
    if (cells) {
      return (
        <>
          {expands && !!expandedRows && <ExpandToggleCell />}
          {expands && !expandedRows && <AccordianSpacer />}
          {toggleSelected && <SelectCell />}
          {cells.map((cellProps, index) => {
            const { key, ...restProps } = cellProps;
            return (
              <TableCell
                key={`snap-ui-table-cell-${key}-${index}`}
                loading={loading}
                {...restProps}
                className={cn(
                  stickyLastColumn && index === cells.length - 1 && classes['sticky-cell'],
                  stickyLastColumn && index === cells.length - 1 && alternateBackground && classes['alternate-background'],
                  restProps.className,
                )}
              />
            );
          })}
        </>
      );
    }
    return null;
  };
  const renderExpandedContent = () => {
    if (expandedRows) {
      return expandedRows.map((cells, i) => (
        <div
          key={`snap-ui-expanded-row-${i}-${cells.map((cell) => cell.key).join('-')}`}
          className={[
            classes['table-row'],
            classes['table-row-expanded'],
            classes['alternate-background'],
          ].join(' ')}
        >
          <AccordianSpacer />
          {toggleSelected && <CheckboxSpacer />}
          {cells.map((cellProps, index) => {
            const { key, ...restProps } = cellProps;
            return <TableCell key={`${cellProps.key}-${index}`} {...restProps} />;
          })}
        </div>
      ));
    }
    return null;
  };

  return (
    <>
      <div
        data-testid='table-row-component'
        className={cn(
          classes['table-row'],
          {
            [classes['expanded']]: expanded,
            [classes['header']]: header,
          },
          alternateBackground ? classes['alternate-background'] : '',
          className
        )}
        {...props}
      >
        {renderContent()}
      </div>
      {!loading && expanded && renderExpandedContent()}
    </>
  );
};

const AccordianSpacer = () => (
  <TableCell key='accordian-cell' type={TableCellType.Accordian} spacer />
);
const CheckboxSpacer = () => (
  <TableCell key='checkbox-cell' type={TableCellType.Checkbox} spacer />
);

export default TableRow;
