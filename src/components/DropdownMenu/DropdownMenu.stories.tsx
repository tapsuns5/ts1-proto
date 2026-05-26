import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  Icon,
  LabelButton,
} from "../../index";

const meta = {
  title: "Components/DropdownMenu",
  component: DropdownMenu,
  parameters: {
    layout: "centered",
    componentSubtitle: (
      <div>
        <p className="sui-mb-1 sui-text-body">
          A dropdown menu component built on Radix UI primitives. Displays a
          list of actions or options triggered by a button, supporting groups,
          labels, checkbox items, radio items, and nested sub-menus.
        </p>
        <div className="sui-mb-2 sui-grid">
          <a
            href="https://www.radix-ui.com/primitives/docs/components/dropdown-menu"
            target="_blank"
            rel="noreferrer"
            className="sui-text-body"
          >
            Dropdown Menu API Reference
          </a>
        </div>

        <p className="sui-mb-1 sui-italic sui-text-caption">
          Click on &quot;Show code&quot; to copy a workable example to your TS
          project.
        </p>
      </div>
    ),
  },
  args: {
    onOpenChange: fn(),
  },
  decorators: [
    (Story) => (
      <div className="sui-flex sui-min-h-[300px] sui-items-start sui-justify-center">
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger asChild>
        <LabelButton
          labelText="Actions"
          icon="expand_more"
          iconPosition="right"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Icon name="edit" size="s" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Icon name="content_copy" size="s" />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Icon name="archive" size="s" />
          Archive
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const ItemVariants: Story = {
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger asChild>
        <LabelButton
          labelText="Player Options"
          icon="expand_more"
          iconPosition="right"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Icon name="edit" size="s" />
          Edit Player
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Icon name="mail" size="s" />
          Send Message
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="negative">
          <Icon name="delete" size="s" />
          Delete Player
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const WithGroupsAndLabels: Story = {
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger asChild>
        <LabelButton
          labelText="Manage"
          icon="expand_more"
          iconPosition="right"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Team</DropdownMenuLabel>
          <DropdownMenuItem>
            <Icon name="group" size="s" />
            View Roster
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Icon name="calendar_today" size="s" />
            Schedule
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Communication</DropdownMenuLabel>
          <DropdownMenuItem>
            <Icon name="mail" size="s" />
            Email Team
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Icon name="chat" size="s" />
            Team Chat
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const WithCheckboxItems: Story = {
  render: function Render(args) {
    const [showEmail, setShowEmail] = useState(true);
    const [showPhone, setShowPhone] = useState(false);
    const [showJerseyNumber, setShowJerseyNumber] = useState(true);

    return (
      <DropdownMenu {...args}>
        <DropdownMenuTrigger asChild>
          <LabelButton labelText="Columns" icon="view_column" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Visible Columns</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={showEmail}
            onCheckedChange={setShowEmail}
          >
            Email
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={showPhone}
            onCheckedChange={setShowPhone}
          >
            Phone
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={showJerseyNumber}
            onCheckedChange={setShowJerseyNumber}
          >
            Jersey Number
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
};

export const WithRadioItems: Story = {
  render: function Render(args) {
    const [sortBy, setSortBy] = useState("name");

    return (
      <DropdownMenu {...args}>
        <DropdownMenuTrigger asChild>
          <LabelButton labelText="Sort By" icon="sort" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Sort Order</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
            <DropdownMenuRadioItem value="name">Name</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="date">
              Date Added
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="position">
              Position
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
};

export const WithSubMenu: Story = {
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger asChild>
        <LabelButton
          labelText="Options"
          icon="expand_more"
          iconPosition="right"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Icon name="edit" size="s" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Icon name="content_copy" size="s" />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Icon name="drive_file_move" size="s" />
            Move to
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>Spring Season</DropdownMenuItem>
            <DropdownMenuItem>Fall Season</DropdownMenuItem>
            <DropdownMenuItem>Archive</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const DisabledItems: Story = {
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger asChild>
        <LabelButton
          labelText="Actions"
          icon="expand_more"
          iconPosition="right"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Icon name="edit" size="s" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <Icon name="content_copy" size="s" />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <Icon name="download" size="s" />
          Export
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="negative" disabled>
          <Icon name="delete" size="s" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const RealWorldPlayerActions: Story = {
  decorators: [
    (Story) => (
      <div className="sui-flex sui-min-h-[500px] sui-items-start sui-justify-center">
        <Story />
      </div>
    ),
  ],
  render: function Render(args) {
    const [availability, setAvailability] = useState("available");

    return (
      <DropdownMenu {...args}>
        <DropdownMenuTrigger asChild>
          <LabelButton labelText="Player Actions" icon="person" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="sui-w-56">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Player</DropdownMenuLabel>
            <DropdownMenuItem>
              <Icon name="edit" size="s" />
              Edit Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Icon name="mail" size="s" />
              Send Message
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Icon name="contact_page" size="s" />
              View Contacts
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel>Availability</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={availability}
              onValueChange={setAvailability}
            >
              <DropdownMenuRadioItem value="available">
                Available
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="injured">
                Injured
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="inactive">
                Inactive
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Icon name="swap_horiz" size="s" />
              Move to Team
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>U12 Thunder</DropdownMenuItem>
              <DropdownMenuItem>U14 Lightning</DropdownMenuItem>
              <DropdownMenuItem>U16 Storm</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="negative">
            <Icon name="person_remove" size="s" />
            Remove from Roster
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
};
