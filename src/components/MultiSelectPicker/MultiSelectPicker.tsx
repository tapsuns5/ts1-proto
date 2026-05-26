import React, {
  ComponentPropsWithoutRef,
  createContext,
  ElementRef,
  forwardRef,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "../../utils";
import Checkbox from "../Checkbox/Checkbox";
import Icon from "../Icon/Icon";
import InputWrapper from "../InputWrapper/InputWrapper";

type MultiSelectPickerProps = PropsWithChildren<{
  label?: string;
  required?: boolean;
  name: string;
  values: string[];
  onValuesChange: (values: string[]) => void;
  className?: string;
}> &
  React.ComponentProps<typeof PopoverPrimitive.Root>;

const MultiSelectPicker: React.FC<MultiSelectPickerProps> = ({
  onValuesChange,
  values,
  children,
  name,
  label,
  required,
  ...props
}) => {
  const [tempValues, setTempValues] = useState(values);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const comboboxSearchInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTempValues(values);
  }, [values]);

  const allValuesAndLabels: { value: string; label: string }[] = useMemo(() => {
    const MultiSelectPickerContentChildren = React.Children.toArray(
      children,
    ).find((child) => (child as any).type === MultiSelectPickerContent);
    const MultiSelectPickerListChildren = React.Children.toArray(
      (MultiSelectPickerContentChildren as any).props.children,
    ).find((child) => (child as any).type === MultiSelectPickerList);
    return React.Children.toArray(
      (MultiSelectPickerListChildren as any).props.children,
    ).reduce((acc: string[], child) => {
      if ((child as any).type === MultiSelectPickerItem) {
        return [
          ...acc,
          ...[
            {
              value: (child as any).props.value,
              label: (child as any).props.label,
            },
          ],
        ];
      }
      if ((child as any).type === MultiSelectPickerGroup) {
        return [
          ...acc,
          ...React.Children.map((child as any).props.children, (child) => ({
            value: (child as any).props.value,
            label: (child as any).props.label,
          })),
        ];
      }
      return acc;
    }, []);
  }, [children]);

  const handleOnChange = (value: string, checked: any) => {
    let newValues;
    if (checked) {
      newValues = [...tempValues, value];
    } else {
      newValues = tempValues.filter((localValue) => localValue !== value);
    }

    setTempValues(newValues);
    onValuesChange(newValues);
    resetInput();
  };

  const handleOnChangeGroupHead = (values: any[], checked: any) => {
    let newValues;
    if (checked) {
      newValues = Array.from(
        new Set([...tempValues, ...values.map((value) => value)]),
      );
    } else {
      newValues = tempValues.filter(
        (tempValue) => !values.some((value) => value === tempValue),
      );
    }

    setTempValues(newValues);
    onValuesChange(newValues);
    resetInput();
  };

  const handleOnSelectAll = (checked: any) => {
    let newValues: React.SetStateAction<string[]> = [];
    if (checked) {
      newValues = allValuesAndLabels.map((option) => option.value);
    }
    setTempValues(newValues);
    onValuesChange(newValues);
    resetInput();
  };

  const resetInput = () => {
    if (search) {
      setSearch("");
      comboboxSearchInputRef.current?.focus();
    }
  };

  const handleOnOpenChange = (
    value: boolean | ((prevState: boolean) => boolean),
  ) => {
    setTempValues(values);
    setIsOpen(value);
  };

  return (
    <InputWrapper label={label} name={name} required={required}>
      <PopoverPrimitive.Root
        open={isOpen}
        onOpenChange={handleOnOpenChange}
        {...props}
      >
        <MultiSelectPickerContext.Provider
          value={{
            tempValues,
            values,
            handleOnChange,
            handleOnChangeGroupHead,
            handleOnSelectAll,
            search,
            setSearch,
            comboboxSearchInputRef,
            allValuesAndLabels,
          }}
        >
          {children}
        </MultiSelectPickerContext.Provider>
      </PopoverPrimitive.Root>
    </InputWrapper>
  );
};

const MultiSelectPickerTrigger = forwardRef<
  ElementRef<typeof PopoverPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger> & {
    placeholder?: string;
    maxVisibleTags?: number;
  }
>(
  (
    {
      className,
      children,
      placeholder = "Select",
      asChild,
      maxVisibleTags,
      ...props
    },
    ref,
  ) => {
    const { values, allValuesAndLabels } = useMultiSelectPickerProvider();

    const valuesToDisplay = useMemo(() => {
      if (!maxVisibleTags) return values;
      return values.length >= maxVisibleTags
        ? values.slice(0, maxVisibleTags - 1)
        : values.slice(0, maxVisibleTags);
    }, [values, maxVisibleTags]);

    if (asChild) {
      return (
        <PopoverPrimitive.Trigger
          className={cn(className)}
          ref={ref}
          asChild
          {...props}
        >
          {children}
        </PopoverPrimitive.Trigger>
      );
    }

    const renderedTags = useMemo(
      () =>
        renderTriggerTags(
          values,
          valuesToDisplay,
          placeholder,
          maxVisibleTags,
          allValuesAndLabels,
          TriggerTag,
        ),
      [
        values,
        valuesToDisplay,
        placeholder,
        maxVisibleTags,
        allValuesAndLabels,
      ],
    );

    return (
      <>
        <PopoverPrimitive.Trigger
          className={cn(
            "sui-flex sui-min-h-[48px] sui-cursor-pointer sui-items-center sui-gap-1 sui-rounded sui-border sui-border-solid sui-border-neutral-border sui-bg-white sui-px-1 sui-py-1 sui-pr-0.5 sui-text-desktop-5 sui-text-neutral-text-weak hover:sui-border-action-border-hover data-[state=open]:sui-border-action-border-hover",
            className,
          )}
          ref={ref}
          {...props}
        >
          <div className="sui-flex sui-max-w-[calc(100%-36px)] sui-flex-1 sui-flex-wrap sui-gap-0.5">
            {renderedTags}
          </div>
          <Icon name="arrow_drop_down" />
        </PopoverPrimitive.Trigger>
      </>
    );
  },
);
MultiSelectPickerTrigger.displayName = "MultiSelectPickerTrigger";

const TriggerTag = ({
  className,
  value,
  ...props
}: PropsWithChildren<{
  className?: string;
  value: string;
}>) => {
  const { handleOnChange } = useMultiSelectPickerProvider();

  return (
    <span
      className={cn(
        "sui-flex sui-h-[28px] sui-items-center sui-whitespace-nowrap sui-rounded sui-bg-action-background-weak sui-px-1 sui-text-left sui-text-neutral-text sui-label",
        className,
      )}
      {...props}
    >
      <>
        {props.children}
        <Icon
          name="close"
          size="s"
          className="sui-ml-1 sui-cursor-pointer sui-text-neutral-icon"
          onClick={(event: {
            stopPropagation: () => void;
            preventDefault: () => void;
          }) => {
            event.stopPropagation();
            event.preventDefault();
            handleOnChange(value, false);
          }}
        />
      </>
    </span>
  );
};

const MultiSelectPickerContent = React.forwardRef<
  ElementRef<typeof PopoverPrimitive.Content>,
  ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(
  (
    {
      className,
      align = "start",
      sideOffset = 0,
      collisionPadding = 16,
      ...props
    },
    ref,
  ) => {
    return (
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          className={cn(
            "sui-z-50 sui-h-fit sui-max-h-[var(--radix-popover-content-available-height)] sui-min-w-[320px] sui-overflow-y-auto sui-rounded sui-border sui-border-solid sui-border-neutral-border sui-bg-white sui-pt-1 sui-shadow-up",
            className,
          )}
          align={align}
          sideOffset={sideOffset}
          collisionPadding={collisionPadding}
          ref={ref}
          {...props}
        >
          {props.children}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    );
  },
);
MultiSelectPickerContent.displayName = "MultiSelectPickerContent";

const MultiSelectPickerHelpText = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      className={cn(
        "sui-px-2 sui-pb-1 sui-pt-1 sui-text-desktop-4 sui-text-neutral-text-medium",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});

const MultiSelectPickerSearchInput = forwardRef<
  HTMLInputElement,
  ComponentPropsWithoutRef<"input">
>(({ className, ...props }, ref) => {
  const { search, setSearch, comboboxSearchInputRef } =
    useMultiSelectPickerProvider();
  return (
    <div className={cn("sui-px-2 sui-pb-0.5 sui-pt-0.5", className)} ref={ref}>
      <div className="sui-relative">
        <Icon
          name="search"
          className="sui-absolute sui-text-neutral-icon-medium [left:8px] [top:8px]"
        />
        <input
          className="sui-h-5 sui-w-full sui-rounded sui-border sui-border-solid sui-border-neutral-border sui-p-1 sui-pl-[36px] sui-text-desktop-5 sui-outline-none focus:sui-border-action-border-hover"
          value={search}
          onChange={(ev) => setSearch(ev.target.value)}
          ref={comboboxSearchInputRef}
          {...props}
        />
      </div>
    </div>
  );
});
MultiSelectPickerSearchInput.displayName = "MultiSelectPickerSearchInput";

const MultiSelectPickerList = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => {
  const { tempValues, handleOnSelectAll, search, allValuesAndLabels } =
    useMultiSelectPickerProvider();

  const areSomeItemsFound = useMemo(() => {
    return allValuesAndLabels.some((option) =>
      option.label.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, allValuesAndLabels]);

  return (
    <>
      {!search && (
        <div className="sui-border-b sui-border-solid sui-border-neutral-border sui-px-2 sui-py-1">
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
            onChange={(ev: { target: { checked: boolean } }) =>
              handleOnSelectAll(ev.target.checked)
            }
          />
        </div>
      )}
      <div ref={ref} className="sui-py-1">
        {!areSomeItemsFound && (
          <p className="sui-p-2 sui-pt-3 sui-text-center sui-text-neutral-text">
            No results found.
          </p>
        )}
        {props.children}
      </div>
    </>
  );
});
MultiSelectPickerList.displayName = "MultiSelectPickerList";

const MultiSelectPickerGroup = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<"div"> & {
    label: string;
  }
>(({ className, label, ...props }, ref) => {
  const { handleOnChangeGroupHead, search, tempValues } =
    useMultiSelectPickerProvider();

  const childItemsValuesAndLabels = useMemo(() => {
    return React.Children.map(props.children, (child) => {
      return {
        value: (child as any).props.value,
        label: (child as any).props.label,
      };
    });
  }, [props.children]);

  const shouldDisplayGroupHeading = useMemo(() => {
    if (search) {
      return childItemsValuesAndLabels?.some((item) =>
        item.label.toLowerCase().includes(search.toLowerCase()),
      );
    }
    return true;
  }, [search, childItemsValuesAndLabels]);

  return (
    <div
      className={cn(
        "COMBOBOX-GROUP sui-group sui-mb-0.5 sui-border-b sui-border-solid sui-border-neutral-border sui-px-2 sui-pb-0.5 sui-pt-1",
        {
          "sui-mb-0 sui-border-b-transparent !sui-pb-0 !sui-pt-0":
            !shouldDisplayGroupHeading,
        },
        className,
      )}
      ref={ref}
    >
      {shouldDisplayGroupHeading && (
        <div className="sui-flex sui-items-center sui-pb-1">
          <Checkbox
            label=""
            value={label}
            extraProps={{
              input: {
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
              handleOnChangeGroupHead(
                (childItemsValuesAndLabels ?? []).map((item) => item.value),
                ev.target.checked,
              )
            }
          />
          <p className="sui-text-desktop-5 sui-font-bold">{label}</p>
        </div>
      )}
      {props.children}
    </div>
  );
});
MultiSelectPickerGroup.displayName = "MultiSelectPickerGroup";

const MultiSelectPickerItem = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<"div"> & {
    label: string;
    value: string;
  }
>(({ className, label, value, ...props }, ref) => {
  const { tempValues, handleOnChange, search } = useMultiSelectPickerProvider();

  if (search && !label.toLowerCase().includes(search.toLowerCase())) {
    return null;
  }
  return (
    <div
      className={cn(
        "sui-px-2 sui-py-0.5 group-[.COMBOBOX-GROUP]:sui-pl-3",
        className,
      )}
      ref={ref}
      {...props}
    >
      <Checkbox
        label={label}
        value={value}
        extraProps={{
          input: {
            checked: tempValues.includes(value),
            id: `snap-ui-multi-select-picker-item-${props.id ?? value}`,
          },
          label: {
            htmlFor: `snap-ui-multi-select-picker-item-${props.id ?? value}`,
          },
        }}
        onChange={(ev: { target: { checked: boolean } }) =>
          handleOnChange(value, ev.target.checked)
        }
      />
    </div>
  );
});
MultiSelectPickerItem.displayName = "MultiSelectPickerItem";

const MultiSelectPickerContext = createContext<MultiSelectPickerContextProps>(
  null!,
);
const useMultiSelectPickerProvider = () => {
  const context = useContext(MultiSelectPickerContext);
  if (!context) {
    throw new Error(
      "useMultiSelectPickerProvider must be used within a SnapUI MultiSelectPicker",
    );
  }
  return context;
};
type MultiSelectPickerContextProps = {
  tempValues: string[];
  values: string[];
  handleOnChange: (value: string, checked: boolean) => void;
  handleOnChangeGroupHead: (values: string[], checked: boolean) => void;
  handleOnSelectAll: (checked: boolean) => void;
  search: string;
  setSearch: (value: string) => void;
  comboboxSearchInputRef: React.RefObject<HTMLInputElement | null>;
  allValuesAndLabels: { value: string; label: string }[];
};

export default MultiSelectPicker;
export {
  MultiSelectPickerTrigger,
  MultiSelectPickerContent,
  MultiSelectPickerHelpText,
  MultiSelectPickerSearchInput,
  MultiSelectPickerList,
  MultiSelectPickerItem,
  MultiSelectPickerGroup,
};

const renderTriggerTags = (
  values: string[],
  valuesToDisplay: string[],
  placeholder: string,
  maxVisibleTags: number | undefined,
  allValuesAndLabels: { value: string; label: string }[] | undefined,
  TriggerTag: React.ComponentType<{ value: string; children: React.ReactNode }>,
) => {
  if (values.length === 0) {
    return placeholder;
  }

  const tags = valuesToDisplay.map((value) => (
    <TriggerTag key={`trigger-tag-${value}`} value={value}>
      {allValuesAndLabels?.find((option) => option.value === value)?.label}
    </TriggerTag>
  ));

  const overflowBadge = maxVisibleTags && values.length >= maxVisibleTags && (
    <span className="sui-flex sui-h-[28px] sui-items-center sui-whitespace-nowrap sui-rounded sui-bg-action-background-weak sui-px-1 sui-text-left sui-text-neutral-text sui-label">
      {maxVisibleTags === 1
        ? `${values.length - valuesToDisplay.length} selected`
        : `+${values.length - valuesToDisplay.length} more`}
    </span>
  );

  return (
    <>
      {tags}
      {overflowBadge}
    </>
  );
};
