import React, {
  ComponentPropsWithoutRef,
  forwardRef,
  useMemo,
} from "react";
import { Command as CommandPrimitive } from "cmdk";
import { cn } from "../../../utils";
import Checkbox from "../../Checkbox/Checkbox";
import { getIsItemAMatchWithSearchText } from "../ComboboxUtils";
import { useComboboxProvider } from "../Combobox";

type ComboboxGroupProps = Omit<ComponentPropsWithoutRef<"div">, "onChange"> & {
  label?: string;
  heading?: string;
  onChange?: (
    values: string[],
    checked: boolean,
    tempValues: string[],
  ) => string[] | null;
};

const ComboboxGroup = forwardRef<HTMLDivElement, ComboboxGroupProps>(
  ({ className, label, heading, onChange: onChangeHandler, ...props }, ref) => {
    const {
      mode,
      handleOnChangeGroupHead,
      search,
      tempValues,
      setTempValues,
      resetInput,
    } = useComboboxProvider();

    const groupLabel = heading ?? label ?? "";

    const childItemsValuesAndLabels = useMemo(() => {
      return React.Children.map(props.children, (child) => {
        if (React.isValidElement(child)) {
          return {
            value: child.props.value,
            label: child.props.label,
            keywords: child.props.keywords,
          };
        }
        return null;
      })?.filter(Boolean) || [];
    }, [props.children]);

    const shouldDisplayGroupHeading = useMemo(() => {
      if (mode === "single") return true;
      if (search) {
        return childItemsValuesAndLabels?.some((item) =>
          getIsItemAMatchWithSearchText(item, search),
        );
      }
      return true;
    }, [search, childItemsValuesAndLabels, mode]);

    const handleCustomOnChange = (values: string[], checked: boolean) => {
      const updatedValues = onChangeHandler?.(values, checked, tempValues);
      setTempValues(updatedValues ?? []);
      resetInput();
    };

    if (!shouldDisplayGroupHeading) {
      return null;
    }

    if (mode === "single") {
      return (
        <CommandPrimitive.Group
          ref={ref}
          heading={groupLabel}
          className={cn(
            "[&_[cmdk-group-heading]]:sui-text-caption [&_[cmdk-group-heading]]:sui-font-bold [&_[cmdk-group-heading]]:sui-px-2 [&_[cmdk-group-heading]]:sui-py-[2px] [&_[cmdk-group-heading]]:sui-text-neutral-text-medium",
            className,
          )}
          {...props}
        >
          {props.children}
        </CommandPrimitive.Group>
      );
    }

    return (
      <div
        className={cn(
          "COMBOBOX-GROUP sui-group sui-mb-0.5 sui-border-b sui-border-solid sui-border-neutral-border sui-pb-0.5 sui-pt-1",
          {
            "sui-mb-0 sui-border-b-transparent !sui-pb-0 !sui-pt-0":
              !shouldDisplayGroupHeading,
          },
          className,
        )}
        ref={ref}
      >
        <div className="sui-flex sui-items-center sui-pb-1">
          <Checkbox
            label=""
            value={groupLabel}
            extraProps={{
              input: {
                id: groupLabel,
                checked: childItemsValuesAndLabels?.every((item) =>
                  tempValues.includes(item.value),
                ),
              },
            }}
            isPartial={tempValues.some((tempValue) =>
              childItemsValuesAndLabels?.some(
                (item) => item.value === tempValue,
              ),
            )}
            onChange={(ev: { target: { checked: boolean } }) =>
              onChangeHandler
                ? handleCustomOnChange(
                    (childItemsValuesAndLabels ?? []).map((item) => item.value),
                    ev.target.checked,
                  )
                : handleOnChangeGroupHead(
                    (childItemsValuesAndLabels ?? []).map((item) => item.value),
                    ev.target.checked,
                  )
            }
          />
          <label
            htmlFor={groupLabel}
            className="sui-cursor-pointer !sui-font-bold sui-text-body"
          >
            {groupLabel}
          </label>
        </div>
        {props.children}
      </div>
    );
  },
);
ComboboxGroup.displayName = "ComboboxGroup";

export { ComboboxGroup, type ComboboxGroupProps };
