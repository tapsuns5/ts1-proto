import React from 'react';
import PropTypes from 'prop-types';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Pagination from './Pagination';
import { PaginationProps } from './Pagination.types';
import { on } from 'events';

describe('Pagination', () => {
  const onPageChange = jest.fn();
  beforeEach(() => {
    onPageChange.mockClear();
  });
  it('should render pagination', () => {
    const props: PaginationProps = {
      onPageChange,
      totalCount: 200,
      currentPage: 1,
      pageSize: 10,
    };
    const { getByTestId } = render(<Pagination {...props} />);
    const Pagination_component = getByTestId('pagination-component');
    expect(Pagination_component).toHaveTextContent('Previous');
    expect(Pagination_component).toHaveTextContent('Next');
    expect(Pagination_component).toHaveTextContent('1 - 10 of 200');
  });

  it('should call onPageChange', async () => {
    const props: PaginationProps = {
      onPageChange,
      totalCount: 200,
      currentPage: 2,
      pageSize: 10,
    };
    const { getByTestId, getByText } = render(<Pagination {...props} />);
    const Pagination_component = getByTestId('pagination-component');
    expect(Pagination_component).toBeInTheDocument();

    const next_btn = getByText('Next');
    fireEvent.click(next_btn);
    expect(onPageChange).toHaveBeenCalledWith(3);

    const prev_btn = getByText('Previous');
    fireEvent.click(prev_btn);
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('should not change on last page', async () => {
    const props: PaginationProps = {
      onPageChange,
      totalCount: 200,
      currentPage: 20,
      pageSize: 10,
    };
    const { getByTestId, getByText } = render(<Pagination {...props} />);
    const next_btn = getByText('Next');
    await fireEvent.click(next_btn);

    expect(onPageChange).toHaveBeenCalledTimes(0);
  });

  /**
   * WARNING: Changing options for or deleting existing props can be a breaking
   * change! Make breaking changes clear in commit notes and version numbers!
   */
  it('should allow all expected props', () => {
    // List all required props
    let propTest: PaginationProps = {
      totalCount: 1,
      currentPage: 1,
      pageSize: 1,
      onPageChange,
    };
    // List all remaining options for required props and optional props
    propTest.siblingCount = 1;
    propTest.hideText = true;
    propTest.hideText = false;
  });
});
