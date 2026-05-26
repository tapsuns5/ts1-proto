import { forwardRef, useMemo, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxHelpText,
  ComboboxItem,
  ComboboxList,
  ComboboxSearchInput,
  ComboboxTrigger,
  Icon,
  Select,
} from "../../index";
import { cn } from "../../utils";
import { ComboboxDateFilter, ComboboxStringFilter } from "./Combobox";

const meta = {
  component: Combobox,
  title: "Components/Combobox",
  parameters: {
    layout: "centered",
    componentSubtitle: (
      <div>
        <p className="sui-mb-1">
          This is a Combobox component made with RadixUI Popover.
        </p>
        <div className="sui-grid">
          <a
            href="https://www.radix-ui.com/primitives/docs/components/popover#api-reference"
            target="_blank"
            rel="noreferrer"
            className="sui-text-desktop-5"
          >
            Popover API Reference
          </a>
        </div>
      </div>
    ),
    design: {
      type: "figma",
      url: "https://www.figma.com/file/2vZLIgCHW68rAMedOMsl6h?type=design%27&node-id=286:45107",
    },
  },
  argTypes: {
    // These argTypes are for documentation purposes in the Storybook controls panel
    // @ts-expect-error TODO: We should move this documentation somewhere else
    "<Combobox />": {
      control: null,
      description:
        "The Combobox main wrapper, main props are `values` and `onValuesChange` plus any other **RadixUI Popover Root** component props, see the [API Reference](https://www.radix-ui.com/primitives/docs/components/popover#root)",
    },
    "<ComboboxTrigger />": {
      control: null,
      description:
        "The Combobox Trigger, main props are `placeholder` and `className`, the latter is normally used to control the width via tailwindcss utilities or any custom CSS classes.",
    },
    "<ComboboxContent />": {
      control: null,
      description:
        "The Combobox Content, receive the same props as the **RadixUI Popover Content** component, see the [API Reference](https://www.radix-ui.com/primitives/docs/components/popover#content)",
    },
    "<ComboboxHelpText />": {
      control: null,
      description:
        "The Combobox Help Text, used to provide instruction or context information about the List. It can be placed inside the **Combobox Content**.",
    },
    "<ComboboxSearchInput />": {
      control: null,
      description:
        "The Combobox Search Input, used to filter the items in the **Combobox List**.",
    },
    "<ComboboxList />": {
      control: null,
      description:
        "The Combobox List is the wrapper for all the Combobox Items and Combobox Groups. It can be placed inside the **Combobox Content**.",
    },
    "<ComboboxGroup />": {
      control: null,
      description:
        "The Combobox Group is used to group items inside the **Combobox List**. Main prop is `label`.",
    },
    "<ComboboxItem />": {
      control: null,
      description:
        "The Combobox Item is used to create the items inside a **Combobox List** or **Combobox Group**. Main props are `value` and `label`.",
    },
    "<ComboboxDateFilter />": {
      control: null,
      description:
        "The Combobox Date Filter is a specialized filter component for date-based filtering. It provides a dropdown to select date comparison types (is, is_before, is_after, is_between) and date input fields. The component automatically manages the filter value format as `dateType|startDate|endDate`. Main prop is `label`.",
    },
    "<ComboboxStringFilter />": {
      control: null,
      description:
        "The Combobox String Filter is a specialized filter component for text-based filtering. It provides a dropdown to select string comparison types (empty, not_empty, contains, does_not_contain) and a text input field. The component automatically manages the filter value format as `stringType|textValue`. Main prop is `label`.",
    },
  },
  decorators: [
    (Story) => (
      <div className="sui-flex sui-min-h-[300px] sui-items-start sui-justify-center">
        <Story />
      </div>
    ),
  ],
  args: {
    onValuesChange: fn(),
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleItems: Story = {
  args: {
    values: [],
    onValuesChange: fn(),
  },
  render: function Render(args) {
    const [values, setValues] = useState<string[]>([]);
    return (
      <Combobox
        {...args}
        values={values}
        onValuesChange={(vals) => {
          setValues(vals);
          args.onValuesChange?.(vals);
        }}
      >
        <ComboboxTrigger
          className="sui-w-full sui-max-w-[320px]"
          label="Assets"
        />
        <ComboboxContent headerTitle="Filter by Assets">
          <ComboboxList>
            <ComboboxItem value="banners" label="Banners" />
            <ComboboxItem
              value="products"
              label="Products and coupon distribution"
            />
            <ComboboxItem value="digital" label="Digital Assets" />
            <ComboboxItem value="add-ons" label="Rewarded Add-ons" />
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    );
  },
};

const groupedItemsData = [
  {
    label: "Branded Collateral",
    items: [
      { value: "logo-on-jerseys", label: "Logo on Jerseys" },
      { value: "warm-up", label: "Warm-up apparel" },
      { value: "banners", label: "Banners" },
      { value: "products", label: "Products and coupon distribution" },
    ],
  },
  {
    label: "Experiences",
    items: [
      { value: "seminars", label: "Seminars" },
      { value: "table-and-product", label: "Table and product" },
      { value: "photography", label: "Professional Photography" },
    ],
  },
];

export const GroupedItems: Story = {
  args: {
    values: [],
    onValuesChange: fn(),
  },
  render: function Render(args) {
    const [values, setValues] = useState<string[]>([]);
    return (
      <Combobox
        {...args}
        values={values}
        onValuesChange={(vals) => {
          setValues(vals);
          args.onValuesChange?.(vals);
        }}
      >
        <ComboboxTrigger
          label="Filters"
          className="sui-w-full sui-max-w-[320px]"
        />
        <ComboboxContent className="sui-max-w-[320px]">
          <ComboboxSearchInput placeholder="Search" />
          <ComboboxList>
            {groupedItemsData.map((group) => (
              <ComboboxGroup key={group.label} label={group.label}>
                {group.items.map((item) => (
                  <ComboboxItem
                    key={item.value}
                    value={item.value}
                    label={item.label}
                    keywords={[group.label, item.label]}
                  />
                ))}
              </ComboboxGroup>
            ))}
            <ComboboxItem value="digital" label="Digital Assets" />
            <ComboboxItem value="add-ons" label="Rewarded Add-ons" />
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    );
  },
};

export const WithSearch: Story = {
  ...GroupedItems,
};

export const WithHelpText: Story = {
  args: {
    values: [],
    onValuesChange: fn(),
  },
  render: function Render(args) {
    const [values, setValues] = useState<string[]>([]);
    return (
      <Combobox
        {...args}
        values={values}
        onValuesChange={(vals) => {
          setValues(vals);
          args.onValuesChange?.(vals);
        }}
      >
        <ComboboxTrigger
          label="Filters"
          className="sui-w-full sui-max-w-[320px]"
        />
        <ComboboxContent className="sui-max-w-[320px]">
          <ComboboxSearchInput placeholder="Search" />
          <ComboboxHelpText>
            Select the items you want to sponsor.
          </ComboboxHelpText>
          <ComboboxList>
            {groupedItemsData.map((group) => (
              <ComboboxGroup key={group.label} label={group.label}>
                {group.items.map((item) => (
                  <ComboboxItem
                    key={item.value}
                    value={item.value}
                    label={item.label}
                  />
                ))}
              </ComboboxGroup>
            ))}
            <ComboboxItem value="digital" label="Digital Assets" />
            <ComboboxItem value="add-ons" label="Rewarded Add-ons" />
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    );
  },
};

export const WithoutSelectAll: Story = {
  args: {
    values: [],
    onValuesChange: fn(),
  },
  render: function Render(args) {
    const [values, setValues] = useState<string[]>([]);
    return (
      <Combobox
        {...args}
        values={values}
        onValuesChange={(vals) => {
          setValues(vals);
          args.onValuesChange?.(vals);
        }}
      >
        <ComboboxTrigger
          label="Filters"
          className="sui-w-full sui-max-w-[320px]"
        />
        <ComboboxContent className="sui-max-w-[320px]">
          <ComboboxSearchInput placeholder="Search" />
          <ComboboxList showSelectAllOption={false}>
            {groupedItemsData.map((group) => (
              <ComboboxGroup key={group.label} label={group.label}>
                {group.items.map((item) => (
                  <ComboboxItem
                    key={item.value}
                    value={item.value}
                    label={item.label}
                  />
                ))}
              </ComboboxGroup>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    );
  },
};

export const WithClear: Story = {
  args: {
    values: [],
    onValuesChange: fn(),
  },
  render: function Render(args) {
    const [values, setValues] = useState<string[]>(["logo-on-jerseys"]);
    return (
      <Combobox
        {...args}
        values={values}
        onValuesChange={(vals) => {
          setValues(vals);
          args.onValuesChange?.(vals);
        }}
      >
        <ComboboxTrigger
          label="Filters"
          className="sui-w-full sui-max-w-[320px]"
          onClear={() => setValues([])}
        />
        <ComboboxContent className="sui-max-w-[320px]">
          <ComboboxSearchInput placeholder="Search" />
          <ComboboxList showSelectAllOption={false}>
            {groupedItemsData.map((group) => (
              <ComboboxGroup key={group.label} label={group.label}>
                {group.items.map((item) => (
                  <ComboboxItem
                    key={item.value}
                    value={item.value}
                    label={item.label}
                  />
                ))}
              </ComboboxGroup>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    );
  },
};

type Item = { value: string; label: string };
type ItemGroup = { label: string; items: Item[] };

export const CustomSelectionLogic: Story = {
  args: {
    values: [],
    onValuesChange: fn(),
  },
  render: function Render(args) {
    const [values, setValues] = useState<string[]>([]);

    const items: ItemGroup[] = useMemo(
      () => [
        {
          label: "Branded Collateral",
          items: [
            { value: "logo-on-jerseys", label: "Logo on Jerseys" },
            { value: "warm-up", label: "Warm-up apparel" },
            { value: "banners", label: "Banners" },
          ],
        },
        {
          label: "Experiences",
          items: [
            { value: "seminars", label: "Seminars" },
            { value: "table-and-product", label: "Table and product" },
            { value: "photography", label: "Professional Photography" },
          ],
        },
      ],
      [],
    );

    const experienceItems = useMemo(
      () =>
        items
          .find((group) => group.label === "Experiences")
          ?.items.map((item) => item.value) || [],
      [items],
    );

    const handleValuesChange = (newValues: string[]) => {
      const displayValues = newValues.filter(
        (value) => value !== "all-experiences",
      );
      const allExperiencesSelected = experienceItems.every((item) =>
        displayValues.includes(item),
      );
      setValues(
        allExperiencesSelected
          ? [...displayValues, "all-experiences"]
          : displayValues,
      );
      args.onValuesChange?.(newValues);
    };

    const customHandler = (
      value: string | string[],
      checked: boolean,
      tempValues: string[],
    ) => {
      if (checked) {
        if (value === "all-experiences") {
          const nonExperienceValues = tempValues.filter(
            (v) => !experienceItems.includes(v) && v !== "all-experiences",
          );
          return [
            ...nonExperienceValues,
            ...experienceItems,
            "all-experiences",
          ];
        }
        const newValues = Array.isArray(value) ? value : [...tempValues, value];
        const uniqueValues = Array.from(
          new Set(newValues.filter((v) => v !== "all-experiences")),
        );
        const allExperiencesSelected = experienceItems.every((item) =>
          uniqueValues.includes(item),
        );
        return allExperiencesSelected
          ? [...uniqueValues, "all-experiences"]
          : uniqueValues;
      } else {
        if (value === "all-experiences") {
          return tempValues.filter(
            (v) => !experienceItems.includes(v) && v !== "all-experiences",
          );
        }
        const valuesToRemove = Array.isArray(value) ? value : [value];
        return tempValues.filter(
          (item) =>
            !valuesToRemove.includes(item) && item !== "all-experiences",
        );
      }
    };

    return (
      <Combobox {...args} values={values} onValuesChange={handleValuesChange}>
        <ComboboxTrigger
          label="Filter"
          className="sui-w-full sui-max-w-[320px]"
        />
        <ComboboxContent className="sui-max-w-[320px]">
          <ComboboxList showSelectAllOption={false}>
            <ComboboxItem
              value="all-experiences"
              label="All Experiences"
              className="sui-font-bold"
              onChange={customHandler}
            />
            <hr className="sui-border-t-0 sui-border-neutral-border" />
            {items.map((group) => (
              <ComboboxGroup
                key={group.label}
                label={group.label}
                className="last:sui-mb-0 last:sui-border-none"
                onChange={
                  group.label === "Experiences" ? customHandler : undefined
                }
              >
                {group.items.map((item) => (
                  <ComboboxItem
                    key={item.value}
                    value={item.value}
                    label={item.label}
                    onChange={
                      group.label === "Experiences" ? customHandler : undefined
                    }
                  />
                ))}
              </ComboboxGroup>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    );
  },
};

interface CustomTriggerButtonProps {
  values: string[];
  items: ItemGroup[];
  className?: string;
}

export const CustomTrigger: Story = {
  args: {
    values: [],
    onValuesChange: fn(),
  },
  render: function Render(args) {
    const [values, setValues] = useState<string[]>([]);
    const items: ItemGroup[] = useMemo(
      () => groupedItemsData.map((group) => ({ ...group })),
      [],
    );

    const handleValuesChange = (newValues: string[]) => {
      setValues(Array.from(new Set([...values, ...newValues])));
      args.onValuesChange?.(newValues);
    };

    const CustomTriggerButton = forwardRef<
      HTMLButtonElement,
      CustomTriggerButtonProps
    >(({ values, items: _items, ...props }, ref) => (
      <button
        ref={ref}
        {...props}
        className={cn(
          "sui-flex sui-min-h-[32px] sui-cursor-pointer sui-items-center sui-gap-1 sui-whitespace-nowrap sui-rounded sui-border sui-border-solid sui-border-neutral-border sui-bg-white sui-px-1 sui-py-[2px] sui-pr-0.5 sui-text-desktop-5 sui-text-neutral-text-weak hover:sui-border-action-border-hover data-[state=open]:sui-border-action-border-hover",
          props.className,
        )}
      >
        <div className="sui-flex sui-max-w-[calc(100%-36px)] sui-flex-1 sui-gap-0.5">
          {values.length === 0 && (
            <span className="sui-text-neutral-text">Filter</span>
          )}
          {values.length > 0 && <span>Filters {values.length} selected</span>}
        </div>
        <Icon name="arrow_drop_down" />
      </button>
    ));
    CustomTriggerButton.displayName = "CustomTriggerButton";

    return (
      <Combobox {...args} values={values} onValuesChange={handleValuesChange}>
        <ComboboxTrigger asChild>
          <CustomTriggerButton
            className="sui-w-full sui-max-w-[320px]"
            values={values}
            items={items}
          />
        </ComboboxTrigger>
        <ComboboxContent className="sui-max-w-[320px]">
          <ComboboxList>
            {items.map((group) => (
              <ComboboxGroup
                key={group.label}
                label={group.label}
                className="last:sui-mb-0 last:sui-border-none"
              >
                {group.items.map((item) => (
                  <ComboboxItem
                    key={item.value}
                    value={item.value}
                    label={item.label}
                  />
                ))}
              </ComboboxGroup>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    );
  },
};

const digitalAssetOptions = [
  { value: "desktop-wallpaper", label: "Desktop wallpaper" },
  { value: "phone-wallpaper", label: "Phone wallpaper" },
  { value: "ringtones", label: "Ringtones" },
];
const physicalAssetOptions = [
  { value: "logo-on-jerseys", label: "Logo on Jerseys" },
  { value: "warm-up", label: "Warm-up apparel" },
  { value: "banners", label: "Banners" },
  { value: "products", label: "Products and coupon distribution" },
];

export const ChangingOptions: Story = {
  args: {
    values: [],
    onValuesChange: fn(),
  },
  render: function Render(args) {
    const [assetType, setAssetType] = useState<string | undefined>("digital");
    const [values, setValues] = useState<string[]>(["ringtones"]);
    let options: { value: string; label: string }[] = [];
    if (assetType === "digital") {
      options = digitalAssetOptions;
    }
    if (assetType === "physical") {
      options = physicalAssetOptions;
    }

    return (
      <>
        <Combobox
          {...args}
          values={values}
          onValuesChange={(vals) => {
            setValues(vals);
            args.onValuesChange?.(vals);
          }}
        >
          <ComboboxTrigger
            className="sui-w-full sui-max-w-[320px]"
            label="Assets"
          />
          <ComboboxContent headerTitle="Filter by Assets">
            <div className="sui-mb-2">
              <Select
                size="small"
                isClearable
                label="Choose an asset type"
                required
                name="assetType"
                placeholder="Select"
                options={[
                  { value: "digital", label: "Digital Assets" },
                  { value: "physical", label: "Physical Assets" },
                ]}
                value={assetType}
                onChange={(option) => {
                  setValues([]);
                  if (option == null || Array.isArray(option)) {
                    setAssetType(undefined);
                    return;
                  }
                  setAssetType(option);
                }}
              />
            </div>

            {options.length > 0 && (
              <ComboboxSearchInput
                className="sui-pt-0"
                placeholder="Search by asset type"
              />
            )}

            <ComboboxList showSelectAllOption={assetType != null}>
              {options.map((item) => (
                <ComboboxItem
                  key={item.value}
                  value={item.value}
                  label={item.label}
                />
              ))}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </>
    );
  },
};



export const DateTypeOptions: Story = {
  args: {
    values: [],
    onValuesChange: fn(),
  },
  render: function Render(args) {
    const [values, setValues] = useState<string[]>([]);    
    return (
      <>
        <Combobox
          {...args}
          values={values}
          onValuesChange={(vals) => {
            setValues(vals);
            args.onValuesChange?.(vals);
          }}
        >
          <ComboboxTrigger
            className="sui-w-full sui-max-w-[320px]"
            label="Custom date"
            onClear={() => setValues([])}
          />
          <ComboboxContent headerTitle="Filter by Custom date">
            <ComboboxDateFilter />
          </ComboboxContent>
        </Combobox>
      </>
    );
  },
};

export const StringTypeOptions: Story = {
  args: {
    values: [],
    onValuesChange: fn(),
  },
  render: function Render(args) {
    const [values, setValues] = useState<string[]>([]);    
    return (
      <>
        <Combobox
          {...args}
          values={values}
          onValuesChange={(vals) => {
            setValues(vals);
            args.onValuesChange?.(vals);
          }}
        >
          <ComboboxTrigger
            className="sui-w-full sui-max-w-[320px]"
            label="Custom string"
            onClear={() => setValues([])}
          />
          <ComboboxContent headerTitle="Filter by Custom string">
            <ComboboxStringFilter />
          </ComboboxContent>
        </Combobox>
      </>
    );
  },
};

export const StringTypeOptionWithLabel: Story = {
  args: {
    values: [],
    onValuesChange: fn(),
  },
  render: function Render(args) {
    const [values, setValues] = useState<string[]>([]);    
    return (
      <>
        <Combobox
          {...args}
          values={values}
          onValuesChange={(vals) => {
            setValues(vals);
            args.onValuesChange?.(vals);
          }}
        >
          <ComboboxTrigger
            className="sui-w-full sui-max-w-[320px]"
            label="Custom string"
            onClear={() => setValues([])}
          />
          <ComboboxContent headerTitle="Filter by Custom string">
            <ComboboxStringFilter
             label="Optional label (with default match type empty)"
             defaultMatchType="empty"
              />
          </ComboboxContent>
        </Combobox>
      </>
    );
  },
};

// --- Single-Select Mode Stories ---

export const SingleSelect: Story = {
  args: {
    onValuesChange: fn(),
  },
  render: function Render() {
    const [value, setValue] = useState<string>("");
    const options = [
      { value: "apple", label: "Apple" },
      { value: "banana", label: "Banana" },
      { value: "cherry", label: "Cherry" },
      { value: "dragonfruit", label: "Dragonfruit" },
      { value: "elderberry", label: "Elderberry" },
    ];
    return (
      <Combobox mode="single" value={value} onValueChange={setValue}>
        <ComboboxTrigger variant="input" className="sui-w-[240px]">
          {value
            ? options.find((o) => o.value === value)?.label
            : <span className="sui-text-neutral-text-weak">Select a fruit</span>}
        </ComboboxTrigger>
        <ComboboxContent>
          <ComboboxSearchInput />
          <ComboboxList>
            <ComboboxEmpty>No fruits found</ComboboxEmpty>
            {options.map((option) => (
              <ComboboxItem
                key={option.value}
                value={option.value}
                label={option.label}
                selected={value === option.value}
              />
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    );
  },
};

export const SingleSelectWithGroups: Story = {
  args: {
    onValuesChange: fn(),
  },
  render: function Render() {
    const [value, setValue] = useState<string>("");
    const groups = [
      {
        heading: "Fruits",
        items: [
          { value: "apple", label: "Apple" },
          { value: "banana", label: "Banana" },
          { value: "cherry", label: "Cherry" },
        ],
      },
      {
        heading: "Vegetables",
        items: [
          { value: "carrot", label: "Carrot" },
          { value: "broccoli", label: "Broccoli" },
          { value: "spinach", label: "Spinach" },
        ],
      },
    ];
    const allItems = groups.flatMap((g) => g.items);
    return (
      <Combobox mode="single" value={value} onValueChange={setValue}>
        <ComboboxTrigger variant="input" className="sui-w-[240px]">
          {value
            ? allItems.find((o) => o.value === value)?.label
            : <span className="sui-text-neutral-text-weak">Select an item</span>}
        </ComboboxTrigger>
        <ComboboxContent>
          <ComboboxSearchInput />
          <ComboboxList>
            <ComboboxEmpty>No items found</ComboboxEmpty>
            {groups.map((group) => (
              <ComboboxGroup key={group.heading} heading={group.heading}>
                {group.items.map((item) => (
                  <ComboboxItem
                    key={item.value}
                    value={item.value}
                    label={item.label}
                    selected={value === item.value}
                    keywords={[group.heading]}
                  />
                ))}
              </ComboboxGroup>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    );
  },
};

export const SingleSelectWithStatus: Story = {
  args: {
    onValuesChange: fn(),
  },
  render: function Render() {
    const [value, setValue] = useState<string>("");
    const options = [
      { value: "team-a", label: "Team Alpha" },
      { value: "team-b", label: "Team Bravo" },
      { value: "team-c", label: "Team Charlie" },
    ];
    return (
      <div className="sui-flex sui-gap-4">
        <div>
          <p className="sui-text-label sui-mb-1">Error status</p>
          <Combobox mode="single" value={value} onValueChange={setValue}>
            <ComboboxTrigger variant="input" status="error" className="sui-w-[240px]">
              {value
                ? options.find((o) => o.value === value)?.label
                : <span className="sui-text-neutral-text-weak">Select a team</span>}
            </ComboboxTrigger>
            <ComboboxContent>
              <ComboboxSearchInput />
              <ComboboxList>
                <ComboboxEmpty>No teams found</ComboboxEmpty>
                {options.map((option) => (
                  <ComboboxItem
                    key={option.value}
                    value={option.value}
                    label={option.label}
                    selected={value === option.value}
                  />
                ))}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>
        <div>
          <p className="sui-text-label sui-mb-1">Success status</p>
          <Combobox mode="single" value={value} onValueChange={setValue}>
            <ComboboxTrigger variant="input" status="success" className="sui-w-[240px]">
              {value
                ? options.find((o) => o.value === value)?.label
                : <span className="sui-text-neutral-text-weak">Select a team</span>}
            </ComboboxTrigger>
            <ComboboxContent>
              <ComboboxSearchInput />
              <ComboboxList>
                <ComboboxEmpty>No teams found</ComboboxEmpty>
                {options.map((option) => (
                  <ComboboxItem
                    key={option.value}
                    value={option.value}
                    label={option.label}
                    selected={value === option.value}
                  />
                ))}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>
      </div>
    );
  },
};
