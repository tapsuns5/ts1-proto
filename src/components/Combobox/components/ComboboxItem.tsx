import React, {
  ComponentPropsWithoutRef,
  forwardRef,
  useMemo,
} from "react";
import { Command as CommandPrimitive } from "cmdk";
import { cn } from "../../../utils";
import Checkbox from "../../Checkbox/Checkbox";
import Icon from "../../Icon/Icon";
import { getIsItemAMatchWithSearchText } from "../ComboboxUtils";
import { useComboboxProvider } from "../Combobox";

type ComboboxItemProps = Omit<ComponentPropsWithoutRef<"div">, "onChange" | "onSelect"> & {
  label: string;
  value: string;
  onChange?: (
    value: string,
    checked: boolean,
    tempValues: string[],
  ) => string[] | null;
  onSelect?: () => void;
  selected?: boolean;
  keywords?: string[];
  disabled?: boolean;
};

const ComboboxItem = forwardRef<HTMLDivElement, ComboboxItemProps>(
  (
    {
      className,
      label,
      value,
      onChange: onChangeHandler,
      onSelect: onSelectHandler,
      selected,
      keywords,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const { mode, tempValues, setTempValues, handleOnChange, handleSingleSelect, search, resetInput } =
      useComboboxProvider();

    const renderItem = useMemo(() => {
      if (mode === "single") return true;
      if (!search) return true;
      return getIsItemAMatchWithSearchText({ value, label, keywords }, search);
    }, [search, keywords, label, value, mode]);

    const handleCustomOnChange = (value: string, checked: boolean) => {
      const updatedValues = onChangeHandler?.(value, checked, tempValues);
      setTempValues(updatedValues ?? []);
      resetInput();
    };

    if (!renderItem) {
      return null;
    }

    if (mode === "single") {
      return (
        <CommandPrimitive.Item
          ref={ref}
          value={value}
          keywords={keywords}
          disabled={disabled}
          onSelect={() => {
            onSelectHandler?.();
            handleSingleSelect(value);
          }}
          className={cn(
            "sui-cursor-default sui-group",
            [
              "sui-text-body sui-relative sui-flex sui-select-none sui-items-center sui-px-2 sui-py-1 sui-outline-none",
              "hover:sui-bg-action-background-weak-hover",
              "data-[selected=true]:sui-bg-action-background-weak-hover",
              "data-[disabled=true]:sui-pointer-events-none data-[disabled=true]:sui-opacity-40 hover:data-[disabled=true]:sui-bg-transparent",
            ],
            className,
          )}
          {...props}
        >
          <div
            className={cn(
              "sui-mr-0.5 sui-grid sui-place-content-center sui-size-[20px] sui-opacity-0",
              { "sui-opacity-100": selected },
            )}
          >
            <Icon name="check" size="s" className="sui-text-action-icon" />
          </div>
          {children ?? label}
        </CommandPrimitive.Item>
      );
    }

    return (
      <div
        className={cn("sui-py-0.5 group-[.COMBOBOX-GROUP]:sui-pl-3", className)}
        ref={ref}
        {...props}
      >
        <Checkbox
          label={label}
          value={value}
          extraProps={{
            input: {
              checked: tempValues.includes(value),
              id: `snap-ui-combobox-item-${props.id ?? value}`,
              disabled,
            },
            label: { htmlFor: `snap-ui-combobox-item-${props.id ?? value}` },
          }}
          onChange={(ev: { target: { checked: boolean } }) =>
            onChangeHandler
              ? handleCustomOnChange(value, ev.target.checked)
              : handleOnChange(value, ev.target.checked)
          }
        />
      </div>
    );
  },
);
ComboboxItem.displayName = "ComboboxItem";

export { ComboboxItem, type ComboboxItemProps };
