import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import React from 'react';
import Icon from '../../Icon/Icon';
import TableCell from './TableCell';
import { TableCellProps, TableCellType } from './TableCell.types';

describe('TableCell', () => {
  let props: TableCellProps;

  it('should display text', () => {
    props = {
      key: 'key',
      text: 'My div',
    };
    const { getByTestId } = render(<TableCell {...props} />);
    const TableCell_component = getByTestId('table-cell-component');
    expect(TableCell_component).toHaveTextContent('My div');
  });

  it('should display custom component', () => {
    props = {
      key: 'custom',
      type: TableCellType.Custom,
      children: <Icon name='info' />,
    };
    const { getByTestId } = render(<TableCell {...props} />);
    const TableCell_component = getByTestId('table-cell-component');
    expect(TableCell_component.querySelector('.Icon')).toBeTruthy();
  });

  /**
   * WARNING: Changing options for or deleting existing props can be a breaking
   * change! Make breaking changes clear in commit notes and version numbers!
   */
  it('should allow all expected props', () => {
    // List all required props
    let propTest: TableCellProps = {
      key: 'key',
      children: '',
    };
    // List all remaining options for required props and optional props
    // propTest.type = 'info'
    // propTest.type = 'success'
    // propTest.type = 'warning'
    // propTest.type = 'error'
    // propTest.grayed = true
    // propTest.grayed = false
  });
});
