import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { ActionMenu, IconButton } from "../../index";

// Metadata to configure how stories for this component are displayed
const meta = {
  title: "Deprecated/ActionMenu [Deprecated use the DropdownMenu instead]", // Title in Storybook's sidebar
  component: ActionMenu,
  parameters: {
    // Replicating the layout from v7 to ensure the menu has space to open
    layout: "padded",
    // Keeping the component subtitle and Figma design link from v7
    componentSubtitle: "Main (optional) description on Storybook Docs page",
    design: {
      type: "figma",
      url: "https://www.figma.com/file/B9YbaCM1s3RdIe9kLCLRcu/%F0%9F%92%BB-Web-App-%E2%80%94-Base-Components?type=design&node-id=1114-25765&mode=dev",
    },
  },
  // This component will have an automatically generated Autodocs entry
  tags: ["autodocs"],
  // Define default arguments for all stories
  args: {
    onClose: fn(), // Use `fn` to spy on the onClose arg in the Actions panel
  },
  // Add a decorator to wrap stories and provide a minimum height, similar to the v7 template
  decorators: [
    (Story) => (
      <div
        style={{
          minHeight: "12rem",
          width: "100%",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ActionMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

// Story for the default ActionMenu
export const Default: Story = {
  args: {
    isOpen: true,
    actions: [
      { label: "New", icon: "add", onClick: fn() },
      { label: "Edit", icon: "edit", onClick: fn() },
      { label: "Export", icon: "download", onClick: fn(), disabled: true },
      { label: "Delete", icon: "delete", onClick: fn(), sentiment: "negative" },
      {
        label: "Import",
        icon: "upload",
        onClick: fn(),
        sentiment: "negative",
        disabled: true,
      },
    ],
  },
};

// Story for the ActionMenu without icons
export const NoIcons: Story = {
  args: {
    ...Default.args, // Inherit args from the Default story
    actions: [
      { label: "New", onClick: fn() },
      { label: "Edit", onClick: fn() },
      { label: "Export", onClick: fn(), disabled: true },
      { label: "Delete", onClick: fn(), sentiment: "negative" },
      { label: "Import", onClick: fn(), sentiment: "negative", disabled: true },
    ],
  },
};
// Story for the ActionMenu without icons
export const Single: Story = {
  args: {
    ...Default.args, // Inherit args from the Default story
    actions: [{ label: "Delete", onClick: fn(), sentiment: "negative" }],
  },
};

// Story demonstrating the ActionMenu triggered by a button.
// This uses the `render` function to manage its own state, just like the v7 example.
export const WithButton: Story = {
  args: {
    // Args for this story are passed to the ActionMenu inside the render function
    actions: [
      { label: "New", icon: "add", onClick: fn() },
      { label: "Edit", icon: "edit", onClick: fn() },
      { label: "Export", icon: "download", onClick: fn(), disabled: true },
      { label: "Delete", icon: "delete", onClick: fn(), sentiment: "negative" },
      {
        label: "Import",
        icon: "upload",
        onClick: fn(),
        sentiment: "negative",
        disabled: true,
      },
    ],
  },
  render: (args) => {
    // Storybook's render function allows using hooks for state management
    const [isOpen, setIsOpen] = useState(false);

    // The decorator's wrapper div is still applied, so we don't need extra styling here.
    return (
      <ActionMenu
        {...args} // Pass in args like the `actions` array
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        trigger={
          <IconButton
            icon="more_horiz"
            variant="neutral"
            withBorder
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              setIsOpen((prev) => !prev);
            }}
            size="compact"
          />
        }
      />
    );
  },
};
