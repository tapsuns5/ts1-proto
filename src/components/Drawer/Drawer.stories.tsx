import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { Checkbox, Drawer, IconButton, LabelButton } from "../../index";

const meta = {
  title: "Components/Drawer",
  component: Drawer,
  parameters: {
    componentSubtitle: "Drawer variations",
    // Drawer is an overlay component, 'fullscreen' layout is most appropriate
    layout: "fullscreen",
    design: {
      type: "figma",
      url: "https://www.figma.com/file/4rczTs789zBbC6cpmeXhPJ?type=design&node-id=1%3A21294&mode=dev",
    },
  },
  argTypes: {
    size: {
      control: "select",
      options: ["small", "medium", "large"],
    },
    placement: {
      control: "select",
      options: ["left", "right"],
    },
    open: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <div className="sui-h-[500px]">
        <Story />
      </div>
    ),
  ],
  args: {
    // Mock functions for all stories
    onCloseClick: fn(),
    onClickOutside: fn(),
    open: true, // Most stories show the drawer by default
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

// Common footer element for reuse in multiple stories
const defaultFooter = (
  <>
    <LabelButton variantType="secondary">Cancel</LabelButton>
    <LabelButton variantType="primary">Save</LabelButton>
  </>
);

export const Basic: Story = {
  args: {
    title: "Drawer Title",
    children: <h1>This is the Drawer Body</h1>,
    footer: defaultFooter,
    size: "small",
    testId: "drawer-basic",
  },
};

export const NoCloseButton: Story = {
  args: {
    ...Basic.args,
    title: "Drawer With No Close Button",
    onCloseClick: undefined, // Remove the close handler
  },
};

export const NoFooter: Story = {
  args: {
    ...Basic.args,
    title: "Drawer With No Footer",
    footer: null,
  },
};

export const Medium: Story = {
  args: {
    ...Basic.args,
    title: "Medium Drawer",
    children: <h1>This is the medium Drawer</h1>,
    size: "medium",
  },
};

export const Large: Story = {
  args: {
    ...Basic.args,
    title: "Large Drawer",
    children: <h1>This is the large Drawer</h1>,
    size: "large",
  },
};

export const PlacementLeft: Story = {
  args: {
    ...Basic.args,
    title: "Drawer Left",
    placement: "left",
  },
};

export const ToggleWithState: Story = {
  args: {
    title: "Drawer Left",
    placement: "left",
    open: false,
    testId: "drawer",
    onCloseClick: fn(),
    onClickOutside: fn(),
    footer: (
      <>
        <LabelButton variantType="secondary">Cancel</LabelButton>
        <LabelButton variantType="primary">Save</LabelButton>
      </>
    ),
    children: <h1>This is the Drawer Body</h1>,
  },
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div style={{ padding: "2rem" }}>
        <LabelButton labelText="Open Drawer" onClick={() => setIsOpen(true)} />
        <Drawer
          {...args}
          open={isOpen}
          onCloseClick={() => setIsOpen(false)}
          onClickOutside={() => setIsOpen(false)}
          footer={
            <>
              <LabelButton
                variantType="secondary"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </LabelButton>
              <LabelButton variantType="primary">Save</LabelButton>
            </>
          }
        >
          <h1>This is the Drawer Body</h1>
        </Drawer>
      </div>
    );
  },
};

export const WithComposition: Story = {
  args: {
    title: "Drawer With Composition",
    testId: "drawer-composition",
  },
  render: function Render(args) {
    return (
      <Drawer {...args}>
        <Drawer.Header>Header</Drawer.Header>
        <Drawer.Content className="sui-body">
          <p>
            Lorem ipsum odor amet, consectetuer adipiscing elit. Massa praesent
            malesuada eros aliquam commodo; hac platea augue.
          </p>
          <p>
            Quisque faucibus arcu purus sollicitudin, felis imperdiet tincidunt
            ac. Magnis fringilla hac iaculis iaculis curae mus.
          </p>
        </Drawer.Content>
        <Drawer.Footer>Footer</Drawer.Footer>
      </Drawer>
    );
  },
};

export const WithCompositionComplex: Story = {
  args: {
    title: "Complex Drawer",
    testId: "drawer-complex",
  },
  render: function Render(args) {
    const [accept, setAccept] = useState(false);
    return (
      <Drawer {...args}>
        <Drawer.Header>
          <IconButton
            data-testid="drawer-header-back"
            icon="keyboard_backspace"
            onClick={args.onCloseClick}
            className="sui-text-gray-7"
            size="compact"
          />
          <span className="sui-heading-md">Header</span>
        </Drawer.Header>
        <Drawer.Content className="sui-body">
          <p>
            Lorem ipsum odor amet, consectetuer adipiscing elit. Massa praesent
            malesuada eros aliquam commodo; hac platea augue. Sapien mi
            phasellus lacus vestibulum; dignissim facilisi in varius.
          </p>
        </Drawer.Content>
        <Drawer.Footer className="sui-flex-col">
          <Checkbox
            label="I agree to the terms and conditions"
            checked={accept}
            onChange={() => setAccept(!accept)}
          />
          <div className="sui-flex sui-w-full sui-justify-end">
            <LabelButton variantType="secondary" className="sui-mr-1">
              Cancel
            </LabelButton>
            <LabelButton variantType="primary" disabled={!accept}>
              Save
            </LabelButton>
          </div>
        </Drawer.Footer>
      </Drawer>
    );
  },
};

export const WithCompositionHeaderClose: Story = {
  args: {
    title: "", // Title is provided inside the custom header
    allowEscapeKey: true,
    testId: "drawer-header-close",
  },
  render: function Render(args) {
    return (
      <Drawer {...args}>
        <Drawer.Header>
          <span className="sui-heading-md">Header</span>
          <IconButton
            data-testid="drawer-header-back"
            icon="close"
            onClick={args.onCloseClick}
            className="sui-ml-auto sui-text-gray-7"
            size="compact"
          />
        </Drawer.Header>
        <Drawer.Content className="sui-body">
          <p>
            Lorem ipsum odor amet, consectetuer adipiscing elit. Massa praesent
            malesuada eros aliquam commodo; hac platea augue. Sapien mi
            phasellus lacus vestibulum; dignissim facilisi in varius. Et
            penatibus duis odio leo blandit.
          </p>
        </Drawer.Content>
      </Drawer>
    );
  },
};
