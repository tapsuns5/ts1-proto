import React, {
  ComponentPropsWithoutRef,
  createContext,
  ElementRef,
  forwardRef,
  PropsWithChildren,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Command as CommandPrimitive } from "cmdk";
import { cn } from "../../utils";
import Icon from "../Icon/Icon";
import Input from "../Input/Input";
import {
  findComboboxItemsRecursively,
  getIsItemAMatchWithSearchText,
  isDateFilterValue,
  isStringFilterValue,
  type ComboboxItemInfo,
} from "./ComboboxUtils";
import { ComboboxItem } from "./components/ComboboxItem";

type ComboboxContextProps = {
  mode: "single" | "multi";
  tempValues: string[];
  setTempValues: React.Dispatch<React.SetStateAction<string[]>>;
  values: string[];
  handleOnChange: (value: string, checked: boolean) => void;
  handleOnChangeGroupHead: (values: string[], checked: boolean) => void;
  handleOnSelectAll: (checked: boolean) => void;
  handleOnSave: () => void;
  search: string;
  setSearch: (value: string) => void;
  comboboxSearchInputRef: React.RefObject<HTMLInputElement | null>;
  allValuesAndLabels: { value: string; label: string }[];
  resetInput: () => void;
  disablePortal?: boolean;
  onValuesChange: (values: string[]) => void;
  setIsOpen: (open: boolean) => void;
  handleSingleSelect: (value: string) => void;
};

const ComboboxContext = createContext<ComboboxContextProps | null>(null);
const useComboboxProvider = () => {
  const context = useContext(ComboboxContext);
  if (!context) {
    throw new Error(
      "useComboboxProvider must be used within a SnapUI Combobox",
    );
  }
  return context;
};

type ComboboxProps = PropsWithChildren<{
  mode?: "single" | "multi";
  // Multi-select: array of selected values with array callback
  values?: string[];
  onValuesChange?: (values: string[]) => void;
  // Single-select: single value with scalar callback — kept separate from values/onValuesChange for unambiguous callback signatures
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  disablePortal?: boolean;
}> &
  React.ComponentProps<typeof PopoverPrimitive.Root>;

const Combobox = forwardRef<HTMLDivElement, ComboboxProps>(({
  mode = "multi",
  onValuesChange,
  values: valuesProp,
  value: singleValue,
  onValueChange,
  children,
  className,
  disablePortal = false,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  ...popoverProps
}, ref) => {
  const values = mode === "single"
    ? (singleValue ? [singleValue] : [])
    : (valuesProp ?? []);

  const [tempValues, setTempValues] = useState(values);
  const [internalOpen, setInternalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const comboboxSearchInputRef = React.useRef<HTMLInputElement>(null);

  // Support controlled open state: when the consumer passes open/onOpenChange,
  // use their value and notify them on changes instead of managing internally.
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const setIsOpen = useCallback((nextOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(nextOpen);
    }
    controlledOnOpenChange?.(nextOpen);
  }, [isControlled, controlledOnOpenChange]);

  const allValuesAndLabels: ComboboxItemInfo[] = useMemo(() => {
    return findComboboxItemsRecursively(children, ComboboxItem);
  }, [children]);

  const invalidTempValues = useMemo(() => {
    if (mode === "single") return [];
    const allPossibleValuesSet = new Set(
      allValuesAndLabels.map((option) => option.value),
    );
    return tempValues.filter((item) =>
      !allPossibleValuesSet.has(item) && !isDateFilterValue(item) && !isStringFilterValue(item)
    );
  }, [allValuesAndLabels, tempValues, mode]);
  useEffect(() => {
    if (invalidTempValues.length > 0) {
      setTempValues((prev) =>
        prev.filter((item) => !invalidTempValues.includes(item)),
      );
    }
  }, [invalidTempValues]);

  const handleOnChange = (value: string, checked: boolean) => {
    const newValues = checked
      ? Array.from(new Set([...tempValues, value]))
      : tempValues.filter((item) => item !== value);

    setTempValues(newValues);
    resetInput();
  };

  const handleOnChangeGroupHead = (values: string[], checked: boolean) => {
    const newValues = checked
      ? Array.from(new Set([...tempValues, ...values]))
      : tempValues.filter((item) => !values.includes(item));

    setTempValues(newValues);
    resetInput();
  };

  const handleOnSelectAll = (checked: boolean) => {
    if (checked) {
      setTempValues(allValuesAndLabels.map((option) => option.value));
    } else {
      setTempValues([]);
    }
    resetInput();
  };

  const resetInput = () => {
    if (search) {
      setSearch("");
      comboboxSearchInputRef.current?.focus();
    }
  };

  const handleOnSave = () => {
    onValuesChange?.(tempValues);
    setIsOpen(false);
  };

  const handleOnOpenChange = (value: boolean) => {
    if (mode === "multi") {
      setTempValues(values);
    }
    setIsOpen(value);
  };

  const handleSingleSelect = (value: string) => {
    onValueChange?.(value);
    setIsOpen(false);
  };

  return (
    <PopoverPrimitive.Root
      open={isOpen}
      onOpenChange={handleOnOpenChange}
      {...popoverProps}
    >
      <div ref={ref} className={className}>
        <ComboboxContext.Provider
          value={{
            mode,
            tempValues,
            setTempValues,
            values,
            handleOnChange,
            handleOnChangeGroupHead,
            handleOnSelectAll,
            handleOnSave,
            search,
            setSearch,
            comboboxSearchInputRef,
            allValuesAndLabels,
            resetInput,
            disablePortal,
            onValuesChange: onValuesChange ?? (() => {}),
            setIsOpen,
            handleSingleSelect,
          }}
        >
          {children}
        </ComboboxContext.Provider>
      </div>
    </PopoverPrimitive.Root>
  );
});
Combobox.displayName = "Combobox";

const ComboboxContent = React.forwardRef<
  ElementRef<typeof PopoverPrimitive.Content>,
  ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & {
    headerTitle?: string;
  }
>(
  (
    {
      className,
      align = "start",
      sideOffset = 0,
      collisionPadding = 16,
      headerTitle,
      ...props
    },
    ref,
  ) => {
    const { disablePortal, mode } = useComboboxProvider();

    const contentChildren = mode === "single" ? (
      <CommandPrimitive className="sui-group">
        {props.children}
      </CommandPrimitive>
    ) : (
      props.children
    );

    const content = (
      <PopoverPrimitive.Content
        className={cn(
          mode === "single"
            ? [
                "sui-overflow-y-auto sui-rounded-lg sui-bg-white sui-shadow-md sui-z-[1010] sui-py-1",
                "sui-border sui-border-solid sui-border-neutral-border",
                "sui-w-[var(--radix-popover-trigger-width)]",
                "sui-max-h-[calc(var(--radix-popover-content-available-height)-1.5rem)]",
              ]
            : [
                "sui-border sui-border-neutral-border sui-shadow-2",
                "sui-rounded-xl sui-px-2",
                "sui-z-50 sui-h-fit sui-max-h-[var(--radix-popover-content-available-height)] sui-min-w-[320px] sui-overflow-y-auto sui-bg-white",
              ],
          className,
        )}
        align={align}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        ref={ref}
        {...props}
      >
        {Boolean(headerTitle) && (
          <header className="sui-pb-1 sui-pt-2">
            <p className="!sui-font-bold sui-text-body-dense">{headerTitle}</p>
          </header>
        )}
        {contentChildren}
      </PopoverPrimitive.Content>
    );

    if (disablePortal) {
      return content;
    }

    return <PopoverPrimitive.Portal>{content}</PopoverPrimitive.Portal>;
  },
);
ComboboxContent.displayName = "ComboboxContent";

const ComboboxHelpText = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      className={cn(
        "sui-pb-1 sui-pt-1 sui-text-neutral-text-medium sui-text-label-sm",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});

const ComboboxSearchInput = forwardRef<
  HTMLInputElement,
  ComponentPropsWithoutRef<"input"> & {
    placeholder?: string;
  }
>(({ className, placeholder, ...props }, ref) => {
  const { search, setSearch, comboboxSearchInputRef, mode } = useComboboxProvider();

  const mergedInputRef = useCallback(
    (node: HTMLInputElement | null) => {
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
      (comboboxSearchInputRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
    },
    [ref, comboboxSearchInputRef],
  );

  if (mode === "single") {
    return (
      <div className="sui-relative sui-px-2 sui-py-1">
        <Icon
          name="search"
          size="s"
          className="sui-text-neutral-icon-medium sui-absolute sui-left-3 sui-top-[14px] sui-z-10"
        />
        <CommandPrimitive.Input asChild>
          <Input
            type="text"
            placeholder={placeholder ?? "Search..."}
            ref={ref}
            size="small"
            autoComplete="off"
            className={cn("sui-w-full [&_input]:sui-pl-4", className)}
            {...props}
          />
        </CommandPrimitive.Input>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "sui-sticky sui-z-10 sui-bg-white sui-pb-0.5 sui-pt-2 [top:0px]",
        className,
      )}
    >
      <div className="sui-relative">
        <Icon
          name="search"
          className="sui-absolute sui-text-neutral-icon-medium [left:8px] [top:8px]"
        />
        <Input
          ref={mergedInputRef}
          name="search"
          leftIcon="search"
          allowClear
          type="text"
          placeholder={placeholder ?? "Search by name"}
          size="small"
          className="sui-max-w-[500px] sui-flex-1 sui-rounded-full"
          value={search}
          onChange={(ev: { target: { value: string } }) =>
            setSearch(ev.target.value)
          }
          {...props}
        />
      </div>
    </div>
  );
});
ComboboxSearchInput.displayName = "ComboboxSearchInput";


const ComboboxEmpty = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<"div">
>(({ className, children, ...props }, ref) => {
  const { mode, search, allValuesAndLabels } = useComboboxProvider();

  if (mode === "single") {
    return (
      <CommandPrimitive.Empty
        className={cn(
          "sui-text-body sui-relative sui-flex sui-cursor-default sui-select-none sui-items-center sui-px-2 sui-py-1 sui-text-neutral-text-weak",
          className,
        )}
        ref={ref}
        {...props}
      >
        {children ?? "No results found."}
      </CommandPrimitive.Empty>
    );
  }

  const hasResults = !search || allValuesAndLabels.some((option) =>
    getIsItemAMatchWithSearchText(option, search),
  );

  if (hasResults) return null;

  return (
    <div
      className={cn(
        "sui-relative sui-flex sui-cursor-default sui-select-none sui-items-center sui-px-2 sui-py-1 sui-text-neutral-text-weak sui-text-body",
        className,
      )}
      ref={ref}
      {...props}
    >
      {children ?? "No results found."}
    </div>
  );
});
ComboboxEmpty.displayName = "ComboboxEmpty";

export default Combobox;

export { useComboboxProvider };
export { ComboboxTrigger } from "./components/ComboboxTrigger";
export { ComboboxGroup } from "./components/ComboboxGroup";
export { ComboboxItem } from "./components/ComboboxItem";
export { ComboboxList } from "./components/ComboboxList";
export { ComboboxDateFilter } from "./components/ComboboxDateFilter";
export { ComboboxStringFilter } from "./components/ComboboxStringFilter";

export {
  ComboboxContent,
  ComboboxHelpText,
  ComboboxSearchInput,
  ComboboxEmpty,
};

export {
  parseDateValue,
  createDateValue,
  formatDateLabel,
  parseStringValue,
  createStringValue,
  formatStringLabel,
} from "./ComboboxUtils";
