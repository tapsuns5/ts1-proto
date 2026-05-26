import { renderHook } from "@testing-library/react";
import { usePagination } from "./hooks";

describe("usePagination", () => {
  test("should return the correct range", () => {
    const {result}  = renderHook(usePagination, {initialProps: {
        totalCount: 100,
        pageSize: 10,
        siblingCount: 1,
        currentPage: 1
        }}
    );
    expect(result).toStrictEqual({"current": [1, 2, 3, 4, 5, "...", 10]});
  });
  test("should return 1 if total less than max", () => {
    const {result}  = renderHook(usePagination, {initialProps: {
        totalCount: 9,
        pageSize: 10,
        siblingCount: 1,
        currentPage: 1
        }}
    );
    expect(result).toStrictEqual({"current": [1]});
  });
})
