import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { Checkbox, Icon } from "../../index";

// Metadata to configure how stories for this component are displayed
const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
    componentSubtitle: "Main (optional) description on Storybook Docs page",
    design: {
      type: "figma",
      url: "https://www.figma.com/file/B9YbaCM1s3RdIe9kLCLRcu/%F0%9F%92%BB-Web-App-%E2%80%94-Base-Components?node-id=3%3A3204&mode=dev",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    value: { control: "text" },
    name: { control: "text" },
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
    errors: { control: "object" },
  },
  // Mock the onChange function to log interactions in the Actions panel
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithLabel: Story = {
  args: {
    label: "Button label",
    name: "Checkbox-group",
    value: "sign-up",
  },
};

export const Standalone: Story = {
  args: {},
};

export const WithState: Story = {
  render: function Render(args) {
    const [isChecked, setIsChecked] = useState(false);
    return (
      <Checkbox
        {...args}
        label="Checkbox 1"
        name="Checkbox-group"
        value="1"
        checked={isChecked}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setIsChecked(e.target.checked);
          args.onChange(e);
        }}
      />
    );
  },
};

export const GroupWithState: Story = {
  render: function Render(args) {
    const [checked, setChecked] = useState<string[]>([]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value, checked: isChecked } = event.target;
      const newChecked = isChecked
        ? [...checked, value]
        : checked.filter((v) => v !== value);
      setChecked(newChecked);
      args.onChange(event);
    };

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Checkbox
          {...args}
          label="Checkbox 1"
          name="Checkbox-group"
          value="1"
          checked={checked.includes("1")}
          onChange={handleChange}
        />
        <Checkbox
          {...args}
          label="Checkbox 2"
          name="Checkbox-group"
          value="2"
          checked={checked.includes("2")}
          onChange={handleChange}
        />
      </div>
    );
  },
};

export const CustomLabel: Story = {
  args: {
    label: "Checkbox 1",
    name: "Checkbox-group",
    value: "1",
    children: (
      <>
        Custom label <Icon name="info" size="s" />
      </>
    ),
  },
};

export const HasError: Story = {
  args: {
    label: "Checkbox 1",
    name: "Checkbox-group",
    value: "9",
    errors: ["You must check this box to proceed"],
    children: (
      <>
        Custom label <br /> two lines
      </>
    ),
  },
};
