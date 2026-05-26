import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import TableRow from './TableRow';
import { TableRowProps } from './TableRow.types';

describe('TableRow', () => {
  let props: TableRowProps;

  it('should display text', () => {
    props = {
      __id: '1',
      children: 'My div',
    };
    const { getByTestId } = render(<TableRow {...props} />);
    const TableRow_component = getByTestId('table-row-component');
    expect(TableRow_component).toHaveTextContent('My div');
  });

  /**
   * WARNING: Changing options for or deleting existing props can be a breaking
   * change! Make breaking changes clear in commit notes and version numbers!
   */
  it('should allow all expected props', () => {
    // List all required props
    let propTest: TableRowProps = {
      __id: '1',
      children: '',
    };
    // List all remaining options for required props and optional props
  });

  it('should disable checkbox when isSelectDisabled is true', () => {
    props = {
      __id: '1',
      cells: [],
      isSelectDisabled: true,
      toggleSelected: jest.fn(),
    };
    render(<TableRow {...props} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDisabled();
  });
});
