import React from "react";
import {
  dateTypeOptions,
  stringTypeOptions,
  DATE_VALUE_DELIMITER,
  STRING_VALUE_DELIMITER,
  parseDateValue,
  createDateValue,
  formatDateLabel,
  isDateFilterValue,
  parseStringValue,
  createStringValue,
  formatStringLabel,
  isStringFilterValue,
  getIsItemAMatchWithSearchText,
  findComboboxItemsRecursively,
  type ComboboxItemInfo,
} from "./ComboboxUtils";

describe("ComboboxUtils", () => {
  describe("Constants", () => {
    it("should have correct date type options", () => {
      expect(dateTypeOptions).toEqual([
        { value: "is", label: "Is (exact date match)" },
        { value: "is_before", label: "Is before" },
        { value: "is_after", label: "Is after" },
        { value: "is_between", label: "Is between (2 dates)" },
      ]);
    });

    it("should have correct string type options", () => {
      expect(stringTypeOptions).toEqual([
        { value: "empty", label: "Empty" },
        { value: "not_empty", label: "Not empty" },
        { value: "contains", label: "Contains" },
        { value: "does_not_contain", label: "Does not contain" },
      ]);
    });

    it("should have correct delimiters", () => {
      expect(DATE_VALUE_DELIMITER).toBe("|");
      expect(STRING_VALUE_DELIMITER).toBe("|");
    });
  });

  describe("Date Filter Utilities", () => {
    describe("parseDateValue", () => {
      it("should parse single date values correctly", () => {
        const result = parseDateValue("is|2023-12-01");
        expect(result).toEqual({
          dateType: "is",
          startDate: "2023-12-01",
        });
      });

      it("should parse date range values correctly", () => {
        const result = parseDateValue("is_between|2023-12-01|2023-12-31");
        expect(result).toEqual({
          dateType: "is_between",
          startDate: "2023-12-01",
          endDate: "2023-12-31",
        });
      });

      it("should handle invalid format gracefully", () => {
        const result = parseDateValue("invalid");
        expect(result).toEqual({
          dateType: "is",
          startDate: "",
        });
      });

      it("should handle empty string", () => {
        const result = parseDateValue("");
        expect(result).toEqual({
          dateType: "is",
          startDate: "",
        });
      });
    });

    describe("createDateValue", () => {
      it("should create single date values correctly", () => {
        const result = createDateValue("is", "2023-12-01");
        expect(result).toBe("is|2023-12-01");
      });

      it("should create date range values correctly", () => {
        const result = createDateValue("is_between", "2023-12-01", "2023-12-31");
        expect(result).toBe("is_between|2023-12-01|2023-12-31");
      });

      it("should handle is_between without end date", () => {
        const result = createDateValue("is_between", "2023-12-01");
        expect(result).toBe("is_between|2023-12-01");
      });

      it("should handle non-between types with end date", () => {
        const result = createDateValue("is_after", "2023-12-01", "2023-12-31");
        expect(result).toBe("is_after|2023-12-01");
      });
    });

    describe("formatDateLabel", () => {
      it("should format single date labels correctly", () => {
        const result = formatDateLabel("is", "2023-12-01");
        expect(result).toBe("Is (exact date match) 2023-12-01");
      });

      it("should format date range labels correctly", () => {
        const result = formatDateLabel("is_between", "2023-12-01", "2023-12-31");
        expect(result).toBe("Is between (2 dates) 2023-12-01 and 2023-12-31");
      });

      it("should handle unknown date types", () => {
        const result = formatDateLabel("unknown", "2023-12-01");
        expect(result).toBe("unknown 2023-12-01");
      });

      it("should handle empty start date", () => {
        const result = formatDateLabel("is", "");
        expect(result).toBe("Is (exact date match)");
      });

      it("should handle is_between with missing end date", () => {
        const result = formatDateLabel("is_between", "2023-12-01", "");
        expect(result).toBe("Is between (2 dates) 2023-12-01");
      });
    });

    describe("isDateFilterValue", () => {
      it("should identify valid date filter values", () => {
        expect(isDateFilterValue("is|2023-12-01")).toBe(true);
        expect(isDateFilterValue("is_before|2023-12-01")).toBe(true);
        expect(isDateFilterValue("is_after|2023-12-01")).toBe(true);
        expect(isDateFilterValue("is_between|2023-12-01|2023-12-31")).toBe(true);
      });

      it("should reject invalid date filter values", () => {
        expect(isDateFilterValue("regular_value")).toBe(false);
        expect(isDateFilterValue("unknown|2023-12-01")).toBe(false);
        expect(isDateFilterValue("is")).toBe(false);
        expect(isDateFilterValue("")).toBe(false);
      });
    });
  });

  describe("String Filter Utilities", () => {
    describe("parseStringValue", () => {
      it("should parse string values correctly", () => {
        const result = parseStringValue("contains|search text");
        expect(result).toEqual({
          stringType: "contains",
          textValue: "search text",
        });
      });

      it("should handle text with delimiters", () => {
        const result = parseStringValue("contains|text|with|pipes");
        expect(result).toEqual({
          stringType: "contains",
          textValue: "text|with|pipes",
        });
      });

      it("should handle empty text value", () => {
        const result = parseStringValue("empty|");
        expect(result).toEqual({
          stringType: "empty",
          textValue: "",
        });
      });

      it("should handle invalid format gracefully", () => {
        const result = parseStringValue("invalid");
        expect(result).toEqual({
          stringType: "contains",
          textValue: "",
        });
      });
    });

    describe("createStringValue", () => {
      it("should create string values correctly", () => {
        const result = createStringValue("contains", "search text");
        expect(result).toBe("contains|search text");
      });

      it("should handle empty text value", () => {
        const result = createStringValue("empty");
        expect(result).toBe("empty|");
      });

      it("should handle undefined text value", () => {
        const result = createStringValue("not_empty", undefined);
        expect(result).toBe("not_empty|");
      });
    });

    describe("formatStringLabel", () => {
      it("should format contains labels correctly", () => {
        const result = formatStringLabel("contains", "search text");
        expect(result).toBe('Contains "search text"');
      });

      it("should format does_not_contain labels correctly", () => {
        const result = formatStringLabel("does_not_contain", "search text");
        expect(result).toBe('Does not contain "search text"');
      });

      it("should format empty labels correctly", () => {
        const result = formatStringLabel("empty");
        expect(result).toBe("Empty");
      });

      it("should format not_empty labels correctly", () => {
        const result = formatStringLabel("not_empty");
        expect(result).toBe("Not empty");
      });

      it("should handle unknown string types", () => {
        const result = formatStringLabel("unknown", "text");
        expect(result).toBe("unknown");
      });

      it("should handle contains without text", () => {
        const result = formatStringLabel("contains");
        expect(result).toBe("Contains");
      });
    });

    describe("isStringFilterValue", () => {
      it("should identify valid string filter values", () => {
        expect(isStringFilterValue("empty|")).toBe(true);
        expect(isStringFilterValue("not_empty|")).toBe(true);
        expect(isStringFilterValue("contains|text")).toBe(true);
        expect(isStringFilterValue("does_not_contain|text")).toBe(true);
      });

      it("should reject invalid string filter values", () => {
        expect(isStringFilterValue("regular_value")).toBe(false);
        expect(isStringFilterValue("unknown|text")).toBe(false);
        expect(isStringFilterValue("contains")).toBe(false);
        expect(isStringFilterValue("")).toBe(false);
      });
    });
  });

  describe("General Utilities", () => {
    describe("getIsItemAMatchWithSearchText", () => {
      const item: ComboboxItemInfo = {
        value: "test_value",
        label: "Test Label",
        keywords: ["keyword1", "keyword2"],
      };

      it("should match by label (case insensitive)", () => {
        expect(getIsItemAMatchWithSearchText(item, "test")).toBe(true);
        expect(getIsItemAMatchWithSearchText(item, "TEST")).toBe(true);
        expect(getIsItemAMatchWithSearchText(item, "Label")).toBe(true);
      });

      it("should match by keywords (case insensitive)", () => {
        expect(getIsItemAMatchWithSearchText(item, "keyword1")).toBe(true);
        expect(getIsItemAMatchWithSearchText(item, "KEYWORD2")).toBe(true);
        expect(getIsItemAMatchWithSearchText(item, "word1")).toBe(true);
      });

      it("should not match when no match found", () => {
        expect(getIsItemAMatchWithSearchText(item, "nomatch")).toBe(false);
        expect(getIsItemAMatchWithSearchText(item, "xyz")).toBe(false);
      });

      it("should handle items without keywords", () => {
        const itemWithoutKeywords = {
          value: "test_value",
          label: "Test Label",
        };
        expect(getIsItemAMatchWithSearchText(itemWithoutKeywords, "test")).toBe(true);
        expect(getIsItemAMatchWithSearchText(itemWithoutKeywords, "keyword")).toBe(false);
      });

      it("should handle empty search text", () => {
        expect(getIsItemAMatchWithSearchText(item, "")).toBe(true);
      });
    });

    describe("findComboboxItemsRecursively", () => {
      // Mock component for testing
      const MockComboboxItem = React.forwardRef<HTMLDivElement, { value: string; label: string; keywords?: string[] }>((props, ref) => {
        return React.createElement("div", { ref, ...props });
      });

      it("should find ComboboxItem components", () => {
        const children = [
          React.createElement(MockComboboxItem, {
            key: "1",
            value: "value1",
            label: "Label 1",
            keywords: ["keyword1"],
          }),
          React.createElement(MockComboboxItem, {
            key: "2",
            value: "value2",
            label: "Label 2",
          }),
        ];

        const result = findComboboxItemsRecursively(children, MockComboboxItem);
        expect(result).toEqual([
          {
            value: "value1",
            label: "Label 1",
            keywords: ["keyword1"],
          },
          {
            value: "value2",
            label: "Label 2",
            keywords: undefined,
          },
        ]);
      });

      it("should handle nested children", () => {
        const nestedChild = React.createElement(MockComboboxItem, {
          key: "nested",
          value: "nested_value",
          label: "Nested Label",
        });

        const parentWithChildren = React.createElement("div", {
          key: "parent",
        }, [nestedChild]);

        const children = [
          React.createElement(MockComboboxItem, {
            key: "1",
            value: "value1",
            label: "Label 1",
          }),
          parentWithChildren,
        ];

        const result = findComboboxItemsRecursively(children, MockComboboxItem);
        expect(result).toEqual([
          {
            value: "value1",
            label: "Label 1",
            keywords: undefined,
          },
          {
            value: "nested_value",
            label: "Nested Label",
            keywords: undefined,
          },
        ]);
      });

      it("should handle empty children", () => {
        const result = findComboboxItemsRecursively([], MockComboboxItem);
        expect(result).toEqual([]);
      });

      it("should handle null/undefined children", () => {
        const result = findComboboxItemsRecursively(null, MockComboboxItem);
        expect(result).toEqual([]);
      });

      it("should ignore non-ComboboxItem components", () => {
        const children = [
          React.createElement("div", { key: "1" }, "Regular div"),
          React.createElement(MockComboboxItem, {
            key: "2",
            value: "value1",
            label: "Label 1",
          }),
          React.createElement("span", { key: "3" }, "Regular span"),
        ];

        const result = findComboboxItemsRecursively(children, MockComboboxItem);
        expect(result).toEqual([
          {
            value: "value1",
            label: "Label 1",
            keywords: undefined,
          },
        ]);
      });

      it("should work without ComboboxItemComponent parameter", () => {
        const children = [
          React.createElement(MockComboboxItem, {
            key: "1",
            value: "value1",
            label: "Label 1",
          }),
        ];

        const result = findComboboxItemsRecursively(children);
        expect(result).toEqual([]);
      });
    });
  });

  describe("Integration Tests", () => {
    it("should handle round-trip date value operations", () => {
      const originalType = "is_between";
      const originalStart = "2023-12-01";
      const originalEnd = "2023-12-31";

      // Create -> Parse -> Format
      const created = createDateValue(originalType, originalStart, originalEnd);
      const parsed = parseDateValue(created);
      const formatted = formatDateLabel(parsed.dateType, parsed.startDate, parsed.endDate);

      expect(parsed.dateType).toBe(originalType);
      expect(parsed.startDate).toBe(originalStart);
      expect(parsed.endDate).toBe(originalEnd);
      expect(formatted).toBe("Is between (2 dates) 2023-12-01 and 2023-12-31");
      expect(isDateFilterValue(created)).toBe(true);
    });

    it("should handle round-trip string value operations", () => {
      const originalType = "contains";
      const originalText = "search text";

      // Create -> Parse -> Format
      const created = createStringValue(originalType, originalText);
      const parsed = parseStringValue(created);
      const formatted = formatStringLabel(parsed.stringType, parsed.textValue);

      expect(parsed.stringType).toBe(originalType);
      expect(parsed.textValue).toBe(originalText);
      expect(formatted).toBe('Contains "search text"');
      expect(isStringFilterValue(created)).toBe(true);
    });

    it("should correctly identify different filter types", () => {
      const dateValue = createDateValue("is", "2023-12-01");
      const stringValue = createStringValue("contains", "text");
      const regularValue = "regular_option";

      expect(isDateFilterValue(dateValue)).toBe(true);
      expect(isStringFilterValue(dateValue)).toBe(false);

      expect(isStringFilterValue(stringValue)).toBe(true);
      expect(isDateFilterValue(stringValue)).toBe(false);

      expect(isDateFilterValue(regularValue)).toBe(false);
      expect(isStringFilterValue(regularValue)).toBe(false);
    });
  });
});
