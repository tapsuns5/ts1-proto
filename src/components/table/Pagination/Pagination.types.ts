/**
 * NOTE: Update Pagination.test.tsx with all additions and changes!
 */
export type PaginationProps = {
  totalCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  
  pageSize?: number;
  siblingCount?: number;
  hideText?: boolean;
  /**
   * Any other props to pass along (comment this out when running tests to catch prop errors)
   */
  [x: string]: any
}
