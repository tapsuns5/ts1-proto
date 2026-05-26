import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { Icon, Select, TooltipProvider } from "../../index";
import { GroupOption, SelectOption } from "./Select.types";

const meta = {
  title: "Components/Select",
  component: Select,
  parameters: {
    componentSubtitle: "Select variations",
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/file/B9YbaCM1s3RdIe9kLCLRcu/%F0%9F%92%BB-Web-App-%E2%80%94-Base-Components?node-id=1114%3A25701&mode=dev",
    },
  },
  argTypes: {
    label: { control: "text" },
    name: { control: "text" },
    isSearchable: { control: "boolean" },
    isMulti: { control: "boolean" },
    isClearable: { control: "boolean" },
    options: { control: undefined },
    value: { control: undefined },
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: "15rem", width: "300px" }}>
        <Story />
      </div>
    ),
  ],
  args: {
    onChange: fn(),
    onCreate: fn(),
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultOptions = ["Dog", "Cat", "Fish"];
const groupedOptions = [
  { label: "Mammals", options: ["Dog", "Cat"] },
  { label: "Fish", options: ["Salmon", "Trout"] },
];

export const Default: Story = {
  args: {
    label: "Pet",
    name: "pet",
    options: defaultOptions,
    value: "Dog",
    placeholder: "Select a pet...",
  },
};

export const WithHelp: Story = {
  render: (args) => (
    <TooltipProvider>
      <Select {...args} />
    </TooltipProvider>
  ),
  args: {
    ...Default.args,
    helpText: "This is help text",
    showHelpIcon: true,
    helpIconTooltipContent: "This is an important info",
  },
};

export const WithError: Story = {
  args: {
    ...Default.args,
    errors: ["This is an error"],
  },
};

export const Searchable: Story = {
  args: {
    label: "Person",
    name: "person",
    options: ["John", "Jane", "Jim", "Jill"],
    isSearchable: true,
  },
};

export const WithCustomOptionLabel: Story = {
  args: {
    ...Default.args,
    getOptionLabel: (option: SelectOption): string => {
      switch (option.value) {
        case "Dog":
          return "🐶 Dog";
        case "Cat":
          return "🐱 Cat";
        case "Fish":
          return "🐟 Fish";
        default:
          return option.label;
      }
    },
  },
};

export const WithFormattedOptionLabel: Story = {
  args: {
    ...Default.args,
    formatOptionLabel: (option: SelectOption): React.ReactNode => {
      const colorMap: { [key: string]: string } = {
        Dog: "blue",
        Cat: "purple",
        Fish: "green",
      };
      const emojiMap: { [key: string]: string } = {
        Dog: "🐶",
        Cat: "🐱",
        Fish: "🐟",
      };
      return (
        <div>
          {emojiMap[option.value]}{" "}
          <span style={{ color: colorMap[option.value] }}>{option.label}</span>
        </div>
      );
    },
  },
};

export const WithFormattedOptionLabelUsingMeta: Story = {
  name: "With Formatted Option Label Using Meta",
  parameters: {
    docs: {
      description: {
        story:
          "This example demonstrates using the `meta` prop in `formatOptionLabel` to render options differently based on context (menu vs selected value). The meta prop provides information about where and how the option is being rendered.",
      },
    },
  },
  args: {
    label: "Team Member",
    name: "team-member",
    options: [
      { label: "John Doe", value: "john" },
      { label: "Jane Smith", value: "jane" },
      { label: "Bob Johnson", value: "bob" },
      { label: "Alice Williams", value: "alice" },
    ],
    value: "john",
    isSearchable: true,
    formatOptionLabel: (option: SelectOption, meta) => {
      const statusColors: { [key: string]: string } = {
        john: "#10b981",
        jane: "#f59e0b",
        bob: "#ef4444",
        alice: "#3b82f6",
      };

      const statusLabels: { [key: string]: string } = {
        john: "Active",
        jane: "Away",
        bob: "Busy",
        alice: "Available",
      };

      if (meta?.context === "value") {
        return (
          <div className="sui-flex sui-items-center sui-gap-2">
            <span
              className="sui-inline-block sui-h-2 sui-w-2 sui-rounded-full"
              style={{ backgroundColor: statusColors[option.value] }}
            />
            <span>{option.label}</span>
          </div>
        );
      }

      if (meta?.context === "menu") {
        return (
          <div className="sui-flex sui-w-full sui-items-center sui-justify-between">
            <div className="sui-flex sui-items-center sui-gap-2">
              <span
                className="sui-inline-block sui-h-2 sui-w-2 sui-rounded-full"
                style={{ backgroundColor: statusColors[option.value] }}
              />
              <span>{option.label}</span>
            </div>
            <span
              className="sui-text-xs sui-rounded sui-px-2 sui-py-0.5"
              style={{
                backgroundColor: `${statusColors[option.value]}20`,
                color: statusColors[option.value],
              }}
            >
              {statusLabels[option.value]}
            </span>
          </div>
        );
      }

      return option.label;
    },
  },
};

export const WithGroups: Story = {
  args: {
    label: "Animal",
    name: "animal",
    options: groupedOptions,
    value: "Salmon",
    isSearchable: true,
    size: "small",
  },
};

export const WithFormattedGroupLabel: Story = {
  args: {
    ...WithGroups.args,
    options: [
      { label: "Mammals", options: ["Dog", "Cat"] },
      { label: "Fish", options: ["Salmon", "Trout", "Bass"] },
    ],
    formatGroupLabel: (group: GroupOption) => (
      <div className="sui-flex sui-items-center sui-gap-1">
        <span>{group.label === "Mammals" ? "🦣" : "🐟"}</span>
        <span>({group.options.length})</span>
        <span>{group.label}</span>
      </div>
    ),
  },
};

export const WithSelectableGroupHeading: Story = {
  name: "With Selectable Group Heading",
  parameters: {
    docs: {
      description: {
        story:
          "This example demonstrates the `value` property on `GroupOption`, which makes the group heading itself a selectable option. When a group has a `value`, clicking the group heading will select that value. Groups without a `value` behave as normal read-only headings.",
      },
    },
  },
  render: function Render(args) {
    const [value, setValue] = useState<string | undefined>(undefined);

    const selectableGroupOptions: GroupOption[] = [
      {
        label: "All Mammals",
        value: "all-mammals",
        options: [
          { label: "Dog", value: "dog" },
          { label: "Cat", value: "cat" },
        ],
      },
      {
        label: "Fish",
        options: [
          { label: "Salmon", value: "salmon" },
          { label: "Trout", value: "trout" },
        ],
      },
      {
        label: "Reptiles",
        value: "all-reptiles",
        options: [
          { label: "No options", value: "__no-options-reptiles", isDisabled: true },
        ],
      },
      {
        label: "Birds",
        value: "all-birds",
        options: [
          { label: "No options", value: "__no-options-birds", isDisabled: true },
        ],
      },
    ];

    return (
      <div>
        <Select
          {...args}
          options={selectableGroupOptions}
          value={value}
          onChange={(newValue) => {
            setValue(newValue as string | undefined);
            args.onChange?.(newValue);
          }}
          formatOptionLabel={(option: SelectOption, meta) => {
            if (
              meta.context === "menu" &&
              option.isDisabled &&
              option.value.startsWith("__no-options")
            ) {
              return (
                <span className="sui-block sui-text-center">
                  {option.label}
                </span>
              );
            }
            return option.label;
          }}
        />
        <div className="sui-mt-4">
          Selected value: {value ?? "None"}
        </div>
        <p className="sui-text-sm sui-mt-2 sui-text-neutral-text-weak">
          Try clicking "All Mammals" (selectable) vs "Fish" (not selectable).
          "Reptiles" and "Birds" have no sub-options but the heading is still
          selectable.
        </p>
      </div>
    );
  },
  args: {
    label: "Animal",
    name: "animal-selectable",
    placeholder: "Select an animal...",
    size: "small",
  },
};

export const WithCreate: Story = {
  args: {
    ...Default.args,
    isSearchable: true,
    formatCreateLabel: (value: string) => (
      <div className="sui-flex sui-items-center sui-gap-1">
        <Icon name="add" />
        <span>Create New: {value}</span>
      </div>
    ),
  },
};

export const Multiple: Story = {
  args: {
    label: "Pets",
    name: "pets",
    options: defaultOptions,
    isMulti: true,
    value: ["Dog", "Cat"],
  },
};

export const WithClear: Story = {
  name: "With Clear Button",
  parameters: {
    docs: {
      description: {
        story:
          "This example shows a select component with clearing functionality. The clear button (✕) appears when a value is selected and hides the dropdown arrow. Clicking it will reset the selection.",
      },
    },
  },
  render: function Render(args) {
    const [value, setValue] = useState<string | undefined>("Dog");
    return (
      <div>
        <Select
          {...args}
          value={value}
          onChange={(newValue) => {
            setValue(newValue as string | undefined);
            args.onChange?.(newValue);
          }}
        />
        <div className="sui-mt-4">Current value: {value ?? "No selection"}</div>
      </div>
    );
  },
  args: {
    label: "Single Select with Clear",
    name: "single-clear",
    options: ["Dog", "Cat", "Fish", "Bird"],
    placeholder: "Select an animal...",
    size: "small",
    isClearable: true,
  },
};

export const WithMenuSearchable: Story = {
  name: "With Menu Searchable",
  parameters: {
    docs: {
      description: {
        story:
          "This example shows a select with the `menuSearchable` prop, which adds a search input inside the dropdown menu that filters options as you type. Uses `menuPlacement='auto'` and `menuPosition='fixed'` to automatically open above or below based on available space.",
      },
    },
  },
  render: function Render(args) {
    const [value, setValue] = useState<string | undefined>("unassigned");

    const teamOptions: GroupOption[] = [
      {
        label: "",
        options: [{ label: "Unassigned", value: "unassigned" }],
      },
      {
        label: "No Division",
        options: [
          { label: "Foxes (No Division)", value: "foxes" },
          { label: "Owls (No Division)", value: "owls" },
          { label: "Team 1 (No Division)", value: "team1" },
        ],
      },
      {
        label: "U8",
        options: [
          { label: "Cubs", value: "cubs" },
          { label: "Dodgers", value: "dodgers" },
          { label: "Giants", value: "giants" },
          { label: "Mariners", value: "mariners" },
          { label: "Mets", value: "mets" },
        ],
      },
      {
        label: "U10 Minors",
        options: [
          { label: "Team Alpha", value: "alpha" },
          { label: "Team Beta", value: "beta" },
          { label: "Team Gamma", value: "gamma" },
          { label: "Team Delta", value: "delta" },
        ],
      },
    ];

    return (
      <div>
        <Select
          {...args}
          options={teamOptions}
          value={value}
          onChange={(newValue) => {
            setValue(newValue as string | undefined);
            args.onChange?.(newValue);
          }}
          menuSearchable
          menuPlacement="auto"
          menuPosition="fixed"
          formatGroupLabel={(group: GroupOption) => {
            // Return null for empty labels to avoid extra whitespace
            if (!group.label) return null;
            return (
              <div className="sui-text-xs sui-uppercase sui-tracking-wide sui-text-neutral-text-weak">
                {group.label}
              </div>
            );
          }}
          styles={{
            menu: (base) => ({ ...base, minWidth: "280px" }),
            groupHeading: (base, state) => ({
              ...base,
              // Hide the group heading container when label is empty
              ...(state.data.label ? {} : { display: "none" }),
            }),
          }}
        />
        <div className="sui-mt-4">Current value: {value ?? "No selection"}</div>
      </div>
    );
  },
  args: {
    label: "Team",
    name: "team-search",
    options: [],
    placeholder: "Select a team...",
    size: "small",
  },
};

export const WithScrollToSelected: Story = {
  name: "With Scroll To Selected",
  parameters: {
    docs: {
      description: {
        story:
          "This example demonstrates the `scrollToSelected` prop, which automatically scrolls the dropdown menu to show the currently selected option when opened. This is useful for long lists where the selected item might be out of view.",
      },
    },
  },
  render: function Render(args) {
    const [value, setValue] = useState<string | undefined>("Option 45");

    const manyOptions = Array.from({ length: 50 }, (_, i) => `Option ${i + 1}`);

    return (
      <div>
        <Select
          {...args}
          options={manyOptions}
          value={value}
          onChange={(newValue) => {
            setValue(newValue as string | undefined);
            args.onChange?.(newValue);
          }}
          scrollToSelected
        />
        <div className="sui-mt-4">Current value: {value ?? "No selection"}</div>
        <p className="sui-text-sm sui-mt-2 sui-text-neutral-text-weak">
          Open the dropdown to see it scroll to "Option 45"
        </p>
      </div>
    );
  },
  args: {
    label: "Long List",
    name: "scroll-to-selected",
    options: [],
    placeholder: "Select an option...",
    size: "small",
  },
};

export const WithPassthroughProps: Story = {
  name: "With React-Select Passthrough Props",
  parameters: {
    docs: {
      description: {
        story:
          "This example demonstrates that all react-select props are now automatically available without manually adding them to the type definition. Props like `openMenuOnFocus`, `closeMenuOnSelect`, and any future react-select props work out of the box.",
      },
    },
  },
  args: {
    label: "Pet (with custom behavior)",
    name: "pet-custom",
    options: defaultOptions,
    // React-select passthrough props - these work without being manually defined!
    openMenuOnFocus: true,
    closeMenuOnSelect: true,
    blurInputOnSelect: true,
    menuShouldScrollIntoView: false,
  },
};
