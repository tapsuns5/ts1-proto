import React, {
  ComponentPropsWithoutRef,
  forwardRef,
  useMemo,
  useState,
} from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "../../../utils";
import Input from "../../Input/Input";
import LabelButton from "../../LabelButton/LabelButton";
import {
  stringTypeOptions,
  parseStringValue,
  createStringValue,
  isStringFilterValue,
} from "../ComboboxUtils";
import { useComboboxProvider } from "../Combobox";

type ComboboxStringFilterProps = Omit<ComponentPropsWithoutRef<"div">, "onChange"> & {
  label?: string;
  keywords?: string[];
  defaultMatchType?: "contains" | "does_not_contain" | "empty" | "not_empty";
};

const ComboboxStringFilter = forwardRef<HTMLDivElement, ComboboxStringFilterProps>(
  ({ className, label, defaultMatchType = "contains", keywords, ...props }, ref) => {
    const { tempValues, setTempValues, resetInput, handleOnSave } = useComboboxProvider();

    const [stringType, setStringType] = useState<string>(defaultMatchType);
    const [textValue, setTextValue] = useState("");

    const existingStringValue = useMemo(() => {
      const existingValue = tempValues.find(val => isStringFilterValue(val));
      if (existingValue) {
        return parseStringValue(existingValue);
      }
      return null;
    }, [tempValues]);

    React.useEffect(() => {
      if (existingStringValue) {
        setStringType(existingStringValue.stringType);
        setTextValue(existingStringValue.textValue);
      } else {
        setStringType(defaultMatchType);
        setTextValue("");
      }
    }, [existingStringValue, defaultMatchType]);

    const handleStringTypeChange = (newStringType: string) => {
      setStringType(newStringType);
      updateStringValue(newStringType, textValue);
    };

    const handleTextValueChange = (newTextValue: string) => {
      setTextValue(newTextValue);
      updateStringValue(stringType, newTextValue);
    };

    const updateStringValue = (type: string, text: string) => {
      const filteredValues = tempValues.filter(val => !isStringFilterValue(val));

      const newValue = createStringValue(type, text);
      const newValues = [...filteredValues, newValue];
      setTempValues(newValues);
      resetInput();
    };

    const isTextRequired = stringType === "contains" || stringType === "does_not_contain";

    return (
      <div
        className={cn(
          "sui-py-0.5",
          className,
        )}
        ref={ref}
        {...props}
      >
        {!!label && (
          <div className="sui-mb-2">
            <span className="sui-text-label-sm sui-font-medium sui-text-neutral-text">
              {label}
            </span>
          </div>
        )}
        <div className="sui-flex sui-gap-2 sui-flex-col md:sui-flex-row">
          <Input
            type="select"
            name="string-type-select"
            options={stringTypeOptions}
            className="sui-min-w-[150px]"
            value={stringType}
            onChange={(e: { target: { value: string } }) => handleStringTypeChange(e.target.value)}
          />
          <Input
            type="text"
            name="string-value-input"
            className="sui-flex-1 sui-min-w-[200px]"
            value={textValue}
            onChange={(e: { target: { value: string } }) => handleTextValueChange(e.target.value)}
            placeholder={isTextRequired ? "Enter text..." : "No value needed"}
            inputProps={ {
              readOnly: !isTextRequired
            } }
          />
        </div>
        <footer className="sui-sticky sui-flex sui-justify-end sui-gap-1 sui-border-t sui-border-solid sui-border-neutral-border sui-bg-white sui-py-2 sui-mt-4 [bottom:0px]">
          <PopoverPrimitive.Close asChild>
            <LabelButton variantType="tertiary">Cancel</LabelButton>
          </PopoverPrimitive.Close>
          <LabelButton
            onClick={handleOnSave}
            disabled={isTextRequired && textValue.trim() === ""}
          >
            Apply
          </LabelButton>
        </footer>
      </div>
    );
  },
);
ComboboxStringFilter.displayName = "ComboboxStringFilter";

export { ComboboxStringFilter };
