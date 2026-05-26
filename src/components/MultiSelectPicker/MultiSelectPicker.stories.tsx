import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import {
  MultiSelectPicker,
  MultiSelectPickerContent,
  MultiSelectPickerGroup,
  MultiSelectPickerHelpText,
  MultiSelectPickerItem,
  MultiSelectPickerList,
  MultiSelectPickerSearchInput,
  MultiSelectPickerTrigger,
} from "../../index";

const meta = {
  component: MultiSelectPicker,
  title: "Components/MultiSelectPicker",
  parameters: {
    componentSubtitle: (
      <div>
        <p className="sui-mb-1">
          This is a MultiSelectPicker component made with RadixUI Popover.
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
      url: "https://www.figma.com/design/B9YbaCM1s3RdIe9kLCLRcu/%F0%9F%92%BB-Web-App-%E2%80%94-Base-Components?node-id=4051-39125&t=YHQLvvEdioeb8li5-4",
    },
  },
  argTypes: {
    // Documentation-only argTypes
    // @ts-expect-error fix this in the future
    "<MultiSelectPicker />": { control: null },
    "<MultiSelectPickerTrigger />": { control: null },
    "<MultiSelectPickerContent />": { control: null },
    "<MultiSelectPickerHelpText />": { control: null },
    "<MultiSelectPickerSearchInput />": { control: null },
    "<MultiSelectPickerList />": { control: null },
    "<MultiSelectPickerGroup />": { control: null },
    "<MultiSelectPickerItem />": { control: null },
  },
  decorators: [
    (Story) => (
      <div className="sui-flex sui-min-h-[300px] sui-w-full sui-max-w-xs sui-items-start sui-justify-center">
        <Story />
      </div>
    ),
  ],
  args: {
    onValuesChange: fn(),
  },
  tags: ["autodocs"],
} satisfies Meta<typeof MultiSelectPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

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

export const SingleItems: Story = {
  render: function Render(args) {
    const [values, setValues] = useState<string[]>([]);
    return (
      <MultiSelectPicker
        {...args}
        values={values}
        onValuesChange={(vals) => {
          setValues(vals);
          args.onValuesChange(vals);
        }}
      >
        <MultiSelectPickerTrigger
          placeholder="Select"
          className="sui-w-full"
          maxVisibleTags={2}
        />
        <MultiSelectPickerContent>
          <MultiSelectPickerList>
            <MultiSelectPickerItem value="banners" label="Banners" />
            <MultiSelectPickerItem
              value="products"
              label="Products and coupon distribution"
            />
            <MultiSelectPickerItem value="digital" label="Digital Assets" />
            <MultiSelectPickerItem value="add-ons" label="Rewarded Add-ons" />
          </MultiSelectPickerList>
        </MultiSelectPickerContent>
      </MultiSelectPicker>
    );
  },
  args: {
    required: true,
    label: "Sports",
    name: "sports_select",
    values: [],
  },
};

export const GroupedItems: Story = {
  render: function Render(args) {
    const [values, setValues] = useState<string[]>([]);
    return (
      <MultiSelectPicker
        {...args}
        values={values}
        onValuesChange={(vals) => {
          setValues(vals);
          args.onValuesChange(vals);
        }}
      >
        <MultiSelectPickerTrigger placeholder="Select" className="sui-w-full" />
        <MultiSelectPickerContent>
          <MultiSelectPickerList>
            {groupedItemsData.map((group) => (
              <MultiSelectPickerGroup key={group.label} label={group.label}>
                {group.items.map((item) => (
                  <MultiSelectPickerItem
                    key={item.value}
                    value={item.value}
                    label={item.label}
                  />
                ))}
              </MultiSelectPickerGroup>
            ))}
            <MultiSelectPickerItem value="digital" label="Digital Assets" />
            <MultiSelectPickerItem value="add-ons" label="Rewarded Add-ons" />
          </MultiSelectPickerList>
        </MultiSelectPickerContent>
      </MultiSelectPicker>
    );
  },
  args: {
    label: "Sports",
    name: "sports_select",
    values: [],
  },
};

export const WithSearch: Story = {
  ...GroupedItems,
  render: function Render(args) {
    const [values, setValues] = useState<string[]>([]);
    return (
      <MultiSelectPicker
        {...args}
        values={values}
        onValuesChange={(vals) => {
          setValues(vals);
          args.onValuesChange(vals);
        }}
      >
        <MultiSelectPickerTrigger placeholder="Select" className="sui-w-full" />
        <MultiSelectPickerContent>
          <MultiSelectPickerSearchInput placeholder="Search" />
          <MultiSelectPickerList>
            {groupedItemsData.map((group) => (
              <MultiSelectPickerGroup key={group.label} label={group.label}>
                {group.items.map((item) => (
                  <MultiSelectPickerItem
                    key={item.value}
                    value={item.value}
                    label={item.label}
                  />
                ))}
              </MultiSelectPickerGroup>
            ))}
            <MultiSelectPickerItem value="digital" label="Digital Assets" />
            <MultiSelectPickerItem value="add-ons" label="Rewarded Add-ons" />
          </MultiSelectPickerList>
        </MultiSelectPickerContent>
      </MultiSelectPicker>
    );
  },
};

export const WithHelpText: Story = {
  ...WithSearch,
  render: function Render(args) {
    const [values, setValues] = useState<string[]>([]);
    return (
      <MultiSelectPicker
        {...args}
        values={values}
        onValuesChange={(vals) => {
          setValues(vals);
          args.onValuesChange(vals);
        }}
      >
        <MultiSelectPickerTrigger placeholder="Select" className="sui-w-full" />
        <MultiSelectPickerContent>
          <MultiSelectPickerHelpText>
            Select the items you want to sponsor.
          </MultiSelectPickerHelpText>
          <MultiSelectPickerSearchInput placeholder="Search" />
          <MultiSelectPickerList>
            {groupedItemsData.map((group) => (
              <MultiSelectPickerGroup key={group.label} label={group.label}>
                {group.items.map((item) => (
                  <MultiSelectPickerItem
                    key={item.value}
                    value={item.value}
                    label={item.label}
                  />
                ))}
              </MultiSelectPickerGroup>
            ))}
            <MultiSelectPickerItem value="digital" label="Digital Assets" />
            <MultiSelectPickerItem value="add-ons" label="Rewarded Add-ons" />
          </MultiSelectPickerList>
        </MultiSelectPickerContent>
      </MultiSelectPicker>
    );
  },
};
