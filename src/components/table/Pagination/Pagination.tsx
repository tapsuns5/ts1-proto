import React from "react";
import classes from "./Pagination.module.scss";
import { PaginationProps } from "./Pagination.types";
import { usePagination, DOTS } from "./hooks";

/**
 * Secondary description on Storybook Docs. I can have multiple lines and
   bullets!
  - The primary component has:
    - CSS modules
    - Tailwind styles
    - CSS variables
  - To make sure all different CSS channels are working
  */
const Pagination: React.FC<PaginationProps> = ({
  onPageChange,
  totalCount,
  siblingCount = 1,
  currentPage,
  pageSize = 50,
  hideText = false,
  className = "",
  ...props
}) => {
  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  if (currentPage === 0) {
    return null;
  }

  const onNext = () => {
    currentPage !== lastPage && onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    currentPage !== 1 && onPageChange(currentPage - 1);
  };

  let lastPage = paginationRange?.[paginationRange.length - 1];

  const currenRangeTextMin = (currentPage - 1) * pageSize + 1;
  const currenRangeTextMax = (currentPage - 1) * pageSize + pageSize;

  return (
    <div
      data-testid="pagination-component"
      className={[classes["pagination"], className].join(" ")}
      {...props}>
      {/* TODO: add selector for page size, in the meantime keep span for centering */}
      <span />
      <ul
        data-testid="pagination-list"
        className={[classes["pagination"]].join(" ")}>
        <li
          className={[
            classes["pagination-item"],
            currentPage === 1 ? classes["disabled"] : "",
          ].join(" ")}
          onClick={onPrevious}>
          Previous
        </li>
        {paginationRange?.map((pageNumber, i) => {
          if (pageNumber === DOTS) {
            return (
              <li
                key={`snap-ui-pagination-item-${i}`}
                className={[classes["pagination-item"], classes["dots"]].join(
                  " "
                )}>
                &#8230;
              </li>
            );
          }

          return (
            <li
              key={`snap-ui-pagination-item-${i}`}
              className={[
                classes["pagination-item"],
                pageNumber === currentPage ? classes["selected"] : "",
              ].join(" ")}
              onClick={() => onPageChange(Number(pageNumber))}>
              {pageNumber}
            </li>
          );
        })}
        <li
          className={[
            classes["pagination-item"],
            currentPage === lastPage ? classes["disabled"] : "",
          ].join(" ")}
          onClick={onNext}>
          Next
        </li>
      </ul>
      {hideText ? (
        <span />
      ) : (
        <span className={classes["pagination-text"]}>
          {currenRangeTextMin} -{" "}
          {currenRangeTextMax > totalCount ? totalCount : currenRangeTextMax} of{" "}
          {totalCount}
        </span>
      )}
    </div>
  );
};

export default Pagination;
