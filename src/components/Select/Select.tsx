import React from "react";
import ReactSelect, {
  ClearIndicatorProps,
  components,
  DropdownIndicatorProps,
  FormatOptionLabelMeta,
  GroupBase,
  GroupHeadingProps,
  MenuListProps,
  MenuProps,
  MultiValue,
  SelectComponentsConfig,
  SelectInstance,
  SingleValue,
} from "react-select";
import CreateSelect from "react-select/creatable";
import Icon from "../Icon/Icon";
import Input from "../Input/Input";
import InputWrapper from "../InputWrapper/InputWrapper";
import classes from "./Select.module.scss";
import "./Select.css";
import {
  GroupOption,
  GroupOptionString,
  OptionProperty,
  SelectOption,
  SelectProps,
} from "./Select.types";

/**
 * Secondary description on Storybook Docs. I can have multiple lines and
 bullets!
 - The primary component has:
 - CSS modules
 - Tailwind styles
 - CSS variables
 - To make sure all different CSS channels are working
 */
function SelectInner<IsMulti extends boolean = false>(
  props: SelectProps<IsMulti>,
  ref: React.ForwardedRef<
    SelectInstance<SelectOption, IsMulti, GroupBase<SelectOption>>
  >,
) {
  const {
    id,
    label,
    placeholder,
    required,
    disabled,
    name,
    helpText,
    showHelpIcon = false,
    errors,
    onChange,
    onBlur,
    value,
    size = "default",
    isClearable = false,
    isSearchable = false,
    onCreate,
    formatCreateLabel,
    options,
    formatGroupLabel,
    getOptionLabel,
    formatOptionLabel,
    components: componentsProp = {},
    helpIconTooltipContent,
    className = "",
    styles,
    menuSearchable = false,
    menuSearchPlaceholder = "Search...",
    scrollToSelected = false,
    menuPlacement = "auto",
    menuPosition,
    menuPortalTarget,
    onKeyDown,
    ...rest
  } = props;
  // Extract isMulti separately to preserve generic type parameter
  const isMulti = props.isMulti ?? (false as IsMulti);
  const hasErrors = errors && errors.length > 0;
  const sizeClass = `select__field--${size}`;
  const selectOptions = React.useMemo(
    () => convertStringsToOptions(options),
    [options],
  );

  // State for menu search when menuSearchable is enabled
  const [menuIsOpen, setMenuIsOpen] = React.useState(false);
  const [menuSearchValue, setMenuSearchValue] = React.useState("");
  const searchInputFocusingRef = React.useRef(false);

  const handleMenuOpen = () => setMenuIsOpen(true);

  const handleMenuClose = () => {
    // If the search input is being focused, don't close the menu
    if (searchInputFocusingRef.current) {
      searchInputFocusingRef.current = false;
      return;
    }
    setMenuIsOpen(false);
    setMenuSearchValue("");
  };

  const handleSearchFocus = () => {
    searchInputFocusingRef.current = true;
  };

  // Filter options based on menu search value
  const filteredOptions = React.useMemo(() => {
    if (!menuSearchable || !menuSearchValue.trim()) {
      return selectOptions;
    }
    const searchLower = menuSearchValue.toLowerCase();

    // Check if options are grouped
    if (
      selectOptions.length > 0 &&
      'options' in selectOptions[0] &&
      Array.isArray((selectOptions[0] as GroupOption).options)
    ) {
      return (selectOptions as GroupOption[])
        .map((group) => ({
          ...group,
          options: group.options.filter((opt) =>
            opt.label.toLowerCase().includes(searchLower),
          ),
        }))
        .filter((group) => group.options.length > 0);
    }

    return (selectOptions as SelectOption[]).filter((opt) =>
      opt.label.toLowerCase().includes(searchLower),
    );
  }, [selectOptions, menuSearchValue, menuSearchable]);

  // Compute groupHeaderValues from unfiltered options so the set remains stable during search filtering
  const groupHeaderValues = React.useMemo(
    () => getGroupHeaderValues(selectOptions),
    [selectOptions],
  );

  // Transform groups with `value` into selectable options
  const processedOptions = React.useMemo(
    () => transformSelectableGroups(filteredOptions, groupHeaderValues),
    [filteredOptions, groupHeaderValues],
  );

  // Wrap formatOptionLabel to style group header options like headings
  const internalFormatOptionLabel = React.useMemo(() => {
    if (groupHeaderValues.size === 0) return formatOptionLabel;

    return (
      option: SelectOption,
      meta: FormatOptionLabelMeta<SelectOption>,
    ) => {
      if (meta.context === "menu" && groupHeaderValues.has(option.value)) {
        return (
          <span className="sui-font-semibold sui-uppercase sui-text-desktop-2">
            {option.label}
          </span>
        );
      }
      return formatOptionLabel
        ? formatOptionLabel(option, meta)
        : option.label;
    };
  }, [formatOptionLabel, groupHeaderValues]);

  // Create menu components including optional search and scroll-to-selected
  const menuComponents = React.useMemo((): Partial<
    SelectComponentsConfig<SelectOption, IsMulti, GroupBase<SelectOption>>
  > => {
    const base: Partial<
      SelectComponentsConfig<SelectOption, IsMulti, GroupBase<SelectOption>>
    > = {
      ...componentsProp,
      DropdownIndicator,
      ClearIndicator,
    };
    if (menuSearchable) {
      base.Menu = MenuWithSearch;
    }
    if (scrollToSelected) {
      base.MenuList = ScrollableMenuList;
    }
    if (groupHeaderValues.size > 0) {
      base.GroupHeading = HideEmptyGroupHeading;
    }
    return base;
  }, [componentsProp, menuSearchable, scrollToSelected, groupHeaderValues]);

  const change = (
    newValue: MultiValue<SelectOption> | SingleValue<SelectOption>,
  ) => {
    if (menuSearchable) {
      setMenuSearchValue("");
    }
    // TypeScript limitation: Conditional types based on generics don't narrow in runtime checks.
    // The `if (isMulti)` check doesn't inform TypeScript which branch of the conditional type applies.
    // We must use type assertions matching onChange's signature: IsMulti extends true ? string[] : string | null
    if (isMulti) {
      const values = (newValue as MultiValue<SelectOption>).map((o) => o.value);
      return onChange?.(
        values as IsMulti extends true ? string[] : string | null,
      );
    }
    const singleValue = (newValue as SingleValue<SelectOption>)?.value || null;
    return onChange?.(
      singleValue as IsMulti extends true ? string[] | null : string | null,
    );
  };

  const handleTabKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (
        event.key !== "Tab" ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey
      )
        return;

      const activeEl = document.activeElement as HTMLElement | null;
      if (!activeEl) return;

      const scope =
        activeEl.closest("[role='dialog']") ??
        activeEl.closest("[data-radix-focus-guard]")?.parentElement ??
        document.body;

      const tabbables = getTabbableElements(scope);
      const currentIndex = tabbables.indexOf(activeEl);
      if (currentIndex === -1) return;

      const nextIndex = event.shiftKey ? currentIndex - 1 : currentIndex + 1;
      const nextEl = tabbables[nextIndex];
      if (nextEl) {
        event.preventDefault();
        nextEl.focus();
      }
    },
    [],
  );

  const Control = onCreate ? CreateSelect : ReactSelect;

  const selectedOption = isMulti
    ? findSelectedOptions(processedOptions, value as string[])
    : findSelectedOption(processedOptions, value as string);

  return (
    <InputWrapper
      label={label}
      required={required}
      name={name}
      helpText={helpText}
      showHelpIcon={showHelpIcon}
      errors={errors}
      helpIconTooltipContent={helpIconTooltipContent}
      className={className}
    >
      <Control
        ref={ref}
        name={name}
        inputId={id ?? name}
        className="sui-react-select-control"
        classNamePrefix="sui-react-select"
        classNames={{
          control: () =>
            `${classes["select__field"]} ${
              hasErrors
                ? classes["select__field--error"]
                : classes["select__field--no-error"]
            } ${classes[sizeClass]} ${sizeClass} ${
              isSearchable ? classes["select__field--searchable"] : ""
            }`,
          input: () => classes[`sui-react-select__input-container--${size}`],
          option: (state) =>
            groupHeaderValues.has(state.data.value)
              ? "sui-react-select__option--group-heading"
              : "",
        }}
        value={selectedOption}
        onChange={change}
        placeholder={placeholder}
        options={processedOptions}
        isClearable={isClearable}
        isDisabled={disabled}
        isSearchable={isSearchable}
        onCreateOption={onCreate}
        formatCreateLabel={formatCreateLabel}
        isMulti={isMulti}
        onBlur={onBlur}
        formatGroupLabel={
          formatGroupLabel
            ? (group) =>
                (() => {
                  const foundGroup = findGroup(
                    selectOptions,
                    group.label ?? "",
                  );
                  return foundGroup ? formatGroupLabel(foundGroup) : null;
                })()
            : undefined
        }
        getOptionLabel={getOptionLabel}
        formatOptionLabel={internalFormatOptionLabel}
        menuPortalTarget={menuPortalTarget !== undefined ? menuPortalTarget : document.body}
        menuPlacement={menuPlacement}
        menuPosition={menuPosition}
        components={menuComponents}
        styles={{
          ...styles,
          menu: (base) => ({
            ...base,
            zIndex: 9999,
            position: 'absolute',
          }),
          menuList: (base) => ({
            ...base,
          }),
        }}
        {...{
          menuSearchPlaceholder,
          onMenuSearchChange: setMenuSearchValue,
          onMenuSearchFocus: handleSearchFocus,
          menuSearchValue,
        }}
        menuIsOpen={menuIsOpen}
        onMenuOpen={handleMenuOpen}
        onMenuClose={handleMenuClose}
        openMenuOnFocus
        openMenuOnClick
        menuShouldBlockScroll={false}
        data-testid={`select-${name}`}
        {...rest}
        onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
          handleTabKeyDown(e);
          if (!e.defaultPrevented) {
            onKeyDown?.(e);
          }
        }}
      />
    </InputWrapper>
  );
}

// Type assertion to preserve generics through forwardRef
const Select = React.forwardRef(SelectInner) as <
  IsMulti extends boolean = false,
>(
  props: SelectProps<IsMulti> &
    React.RefAttributes<
      SelectInstance<SelectOption, IsMulti, GroupBase<SelectOption>>
    >,
) => React.ReactElement;

export default Select;


/**
 * Extracts group header values from options. Used to identify which values
 * represent selectable group headers (groups with a `value` property).
 */
function getGroupHeaderValues(options: OptionList): Set<string> {
  const groupHeaderValues = new Set<string>();

  if (
    options.length === 0 ||
    !('options' in options[0] && Array.isArray((options[0] as GroupOption).options))
  ) {
    return groupHeaderValues;
  }

  for (const group of options as GroupOption[]) {
    if (group.value) {
      groupHeaderValues.add(group.value);
    }
  }

  return groupHeaderValues;
}

/**
 * For groups with a `value` property, injects the group heading as a selectable
 * option (first in the group) and clears the native label to avoid duplication.
 */
function transformSelectableGroups(
  options: OptionList,
  groupHeaderValues: Set<string>,
): OptionList {
  if (
    options.length === 0 ||
    !('options' in options[0] && Array.isArray((options[0] as GroupOption).options))
  ) {
    return options;
  }

  return (options as GroupOption[]).map((group) => {
    if (!group.value || !groupHeaderValues.has(group.value)) return group;

    return {
      ...group,
      label: "",
      options: [
        { label: group.label || String(group.value), value: group.value },
        ...group.options,
      ],
    };
  });
}

function convertStringsToOptions(options: OptionProperty): OptionList {
  if (!options || options.length === 0) return [];

  const firstOption = options[0];

  if (typeof firstOption === "string") {
    // It's an array of strings, so we convert to options
    return convertToOptions(options as string[]);
  } else if ((firstOption as SelectOption).value) {
    // It's an array of SelectOptions, so we return it
    return options as SelectOption[];
  } else if (
    typeof (firstOption as GroupOptionString).options[0] === "string"
  ) {
    // It's an array of GroupOptionStrings, so we convert to GroupOptions
    return (options as GroupOptionString[]).map((groupOption) => {
      const newOptions = convertToOptions(groupOption.options as string[]);
      return { label: groupOption.label, options: newOptions };
    });
  } else {
    // It's an array of GroupOptions, so we return it
    return options as GroupOption[];
  }
}

function convertToOptions(options: string[]): SelectOption[] {
  return options.map((o) => ({ value: o, label: o }) as SelectOption);
}

function findSelectedOption(
  options: OptionList,
  value: string,
): SelectOption | null {
  return toSelectOptions(options).find((o) => o.value === value) || null;
}

function findSelectedOptions(
  options: OptionList,
  value: string[],
): SelectOption[] | null {
  if (!value) return null;

  return toSelectOptions(options).filter((o) =>
    (value as string[]).includes(o.value),
  );
}

function toSelectOptions(options: OptionList) {
  if (
    options.length > 0 &&
    'options' in options[0] &&
    Array.isArray((options[0] as GroupOption).options)
  ) {
    return (options as GroupOption[]).flatMap(
      (o) => o.options as SelectOption[],
    );
  }

  return options as SelectOption[];
}

type OptionList = SelectOption[] | GroupOption[];

// Custom props passed through react-select's selectProps
type CustomSelectProps = {
  onMenuSearchFocus?: () => void;
  onMenuSearchChange?: (value: string) => void;
  menuSearchValue?: string;
  menuSearchPlaceholder?: string;
};

const DropdownIndicator = <IsMulti extends boolean = false>(
  props: DropdownIndicatorProps<SelectOption, IsMulti, GroupBase<SelectOption>>,
) => {
  const { selectProps, hasValue } = props;
  if (hasValue && selectProps.isClearable) return null;
  return (
    <components.DropdownIndicator {...props}>
      <span className={classes["dropdown-carat"]} />
    </components.DropdownIndicator>
  );
};

const ClearIndicator = <IsMulti extends boolean = false>(
  props: ClearIndicatorProps<SelectOption, IsMulti, GroupBase<SelectOption>>,
) => {
  const { hasValue } = props;
  if (!hasValue) return null;

  return (
    <components.ClearIndicator {...props}>
      <Icon size="xs" name="close" className="-sui-translate-x-[12px]" />
    </components.ClearIndicator>
  );
};

// Menu component with search input
const MenuWithSearch = <IsMulti extends boolean = false>(
  props: MenuProps<SelectOption, IsMulti, GroupBase<SelectOption>>,
) => {
  const {
    onMenuSearchFocus,
    onMenuSearchChange,
    menuSearchValue,
    menuSearchPlaceholder,
  } = props.selectProps as unknown as CustomSelectProps;
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleSearchInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onMenuSearchFocus?.();
    inputRef.current?.focus();
  };

  return (
    <components.Menu {...props}>
      <div
        className="sui-border-b sui-border-neutral-border sui-bg-white sui-p-1"
        onMouseDown={handleSearchInteraction}
        onTouchStart={handleSearchInteraction}
      >
        <Input
          ref={inputRef}
          name="menu-search"
          type="text"
          leftIcon="search"
          placeholder={menuSearchPlaceholder}
          value={menuSearchValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onMenuSearchChange?.(e.target.value)
          }
          inputProps={{
            onKeyDown: (e: React.KeyboardEvent) => e.stopPropagation(),
            autoComplete: "off",
          }}
        />
      </div>
      {props.children}
    </components.Menu>
  );
};

// Workaround for react-select not scrolling to selected option with menuPortalTarget
const ScrollableMenuList = <IsMulti extends boolean = false>(
  props: MenuListProps<SelectOption, IsMulti, GroupBase<SelectOption>>,
) => {
  const handleRef = React.useCallback((node: HTMLDivElement | null) => {
    if (node) {
      const selectedOption = node.querySelector(
        ".sui-react-select__option--is-selected",
      );
      if (selectedOption) {
        selectedOption.scrollIntoView({ block: "start" });
      }
    }
  }, []);

  return (
    <components.MenuList {...props} innerRef={handleRef}>
      {props.children}
    </components.MenuList>
  );
};

// Custom GroupHeading that hides empty headings from transformed groups
const HideEmptyGroupHeading = <IsMulti extends boolean = false>(
  props: GroupHeadingProps<SelectOption, IsMulti, GroupBase<SelectOption>>,
) => {
  if (!props.children) return null;
  return <components.GroupHeading {...props} />;
};

function findGroup(options: OptionList, label: string): GroupOption | null {
  return (options as GroupOption[]).find((o) => o.label === label) || null;
}

const TABBABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getTabbableElements(container: Element): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(TABBABLE_SELECTOR),
  ).filter((el) => {
    if (getComputedStyle(el).visibility === "hidden") return false;
    if (getComputedStyle(el).display === "none") return false;
    return true;
  });
}
