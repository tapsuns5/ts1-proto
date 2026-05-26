import React, {
  ComponentPropsWithoutRef,
  forwardRef,
  useMemo,
} from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Command as CommandPrimitive } from "cmdk";
import { cn } from "../../../utils";
import Checkbox from "../../Checkbox/Checkbox";
import LabelButton from "../../LabelButton/LabelButton";
import { getIsItemAMatchWithSearchText } from "../ComboboxUtils";
import { useComboboxProvider } from "../Combobox";

const ComboboxList = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<"div"> & {
    showSelectAllOption?: boolean;
    showClearButton?: boolean;
  }
>(
  (
    {
      className,
      showSelectAllOption = true,
      showClearButton = false,
      ...props
    },
    ref,
  ) => {
    const {
      mode,
      handleOnSave,
      tempValues,
      handleOnSelectAll,
      search,
      allValuesAndLabels,
      onValuesChange,
      setIsOpen,
    } = useComboboxProvider();

    const areSomeItemsFound = useMemo(() => {
      return allValuesAndLabels.some((option) =>
        getIsItemAMatchWithSearchText(option, search),
      );
    }, [search, allValuesAndLabels]);

    const handleOnClear = () => {
      onValuesChange([]);
      setIsOpen(false);
    };

    if (mode === "single") {
      return (
        <CommandPrimitive.List ref={ref} className={className} {...props}>
          {props.children}
        </CommandPrimitive.List>
      );
    }

    return (
      <div ref={ref} className={cn("first:sui-pt-1", className)} {...props}>
        {showSelectAllOption && !search && (
          <div className="sui-border-b sui-border-solid sui-border-neutral-border sui-py-1">
            <Checkbox
              label="Select All"
              value="all"
              extraProps={{
                input: {
                  checked: tempValues.length === allValuesAndLabels.length,
                },
              }}
              isPartial={
                tempValues.length > 0 &&
                tempValues.length < allValuesAndLabels.length
              }
              onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
                handleOnSelectAll(ev.target.checked)
              }
            />
          </div>
        )}
        <div className="sui-py-1">
          {!areSomeItemsFound && (
            <p className="sui-pb-2 sui-pt-3 sui-text-center sui-text-neutral-text">
              No results found.
            </p>
          )}
          {props.children}
        </div>
        <footer
          className={cn(
            "sui-sticky sui-flex sui-justify-end sui-gap-1 sui-border-t sui-border-solid sui-border-neutral-border sui-bg-white sui-py-2 [bottom:0px]",
            showClearButton ? "sui-justify-between" : "sui-justify-end",
          )}
        >
          {showClearButton && (
            <LabelButton onClick={handleOnClear} variantType="tertiary">
              Clear
            </LabelButton>
          )}
          <PopoverPrimitive.Close asChild>
            <LabelButton variantType="tertiary">Cancel</LabelButton>
          </PopoverPrimitive.Close>
          <LabelButton onClick={handleOnSave}>Apply</LabelButton>
        </footer>
      </div>
    );
  },
);
ComboboxList.displayName = "ComboboxList";

export { ComboboxList };
