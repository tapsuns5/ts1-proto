import type { Meta, StoryObj } from "@storybook/react";
import {
  Badge,
  CollapsibleCard,
  CollapsibleCardContent,
  CollapsibleCardHeader,
  LabelButton,
} from "../../index";

const meta = {
  title: "Components/CollapsibleCard",
  component: CollapsibleCard,
  subcomponents: {
    CollapsibleCardHeader,
    CollapsibleCardContent,
  } as Record<string, React.ComponentType>,
  parameters: {
    layout: "centered",
    componentSubtitle:
      "A card component that is capable of hiding the content when clicked.",
  },
  argTypes: {
    defaultOpen: {
      control: "boolean",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
      description: "Whether or not the card is open at first render.",
    },
    open: {
      control: "boolean",
      table: {
        type: { summary: "boolean" },
      },
      description:
        "Whether or not the card is open. Can be used to control the state externally.",
    },
    onOpenChange: {
      action: "onOpenChange",
      table: {
        type: { summary: "(open: boolean) => void" },
      },
      description: "Called when the card is opened or closed.",
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof CollapsibleCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <CollapsibleCard defaultOpen {...args}>
      <CollapsibleCardHeader title="Registrant Details" />
      <CollapsibleCardContent>
        <p className="sui-p-3 sui-text-neutral-text-weak sui-text-body">
          Fill in the registrant&apos;s details here.
        </p>
      </CollapsibleCardContent>
    </CollapsibleCard>
  ),
};

export const WithCustomHeader: Story = {
  render: (args) => (
    <CollapsibleCard defaultOpen {...args}>
      <CollapsibleCardHeader>
        <div className="sui-flex sui-w-full sui-flex-row sui-items-center sui-justify-between">
          <div className="sui-flex sui-items-center sui-gap-2">
            <div className="sui-text-neutral-text sui-text-heading-sm">
              Team Roster
            </div>
            <Badge labelText="Active" variant="positive" />
          </div>
          <LabelButton
            variantType="secondary"
            size="compact"
            labelText="Edit"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          />
        </div>
      </CollapsibleCardHeader>
      <CollapsibleCardContent>
        <p className="sui-p-3 sui-text-body">
          This header uses custom children with a badge and a button instead of
          the default title prop.
        </p>
      </CollapsibleCardContent>
    </CollapsibleCard>
  ),
};

export const DefaultClosed: Story = {
  render: (args) => (
    <CollapsibleCard defaultOpen={false} {...args}>
      <CollapsibleCardHeader title="Click to expand" />
      <CollapsibleCardContent>
        <p className="sui-p-3 sui-text-body">This was hidden initially.</p>
      </CollapsibleCardContent>
    </CollapsibleCard>
  ),
};

export const IconOnLeft: Story = {
  render: (args) => (
    <CollapsibleCard defaultOpen {...args}>
      <CollapsibleCardHeader
        title="Icon on the left"
        triggerIconPosition="left"
      />
      <CollapsibleCardContent>
        <p className="sui-p-3 sui-text-body">
          The chevron icon is on the left side of the header.
        </p>
      </CollapsibleCardContent>
    </CollapsibleCard>
  ),
};

export const NoTriggerIcon: Story = {
  render: (args) => (
    <CollapsibleCard defaultOpen {...args}>
      <CollapsibleCardHeader showTriggerIcon={false}>
        <div className="sui-flex sui-w-full sui-flex-row sui-items-center sui-justify-between">
          <div className="sui-text-neutral-text sui-text-heading-sm">
            Custom Controlled Header
          </div>
          <span className="sui-text-action-text-default sui-text-label">
            Click anywhere to toggle
          </span>
        </div>
      </CollapsibleCardHeader>
      <CollapsibleCardContent>
        <p className="sui-p-3 sui-text-body">
          This header has no trigger icon. The consumer has full control of the
          header layout.
        </p>
      </CollapsibleCardContent>
    </CollapsibleCard>
  ),
};
