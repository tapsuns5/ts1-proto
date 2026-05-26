import type { Meta, StoryObj } from "@storybook/react";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../index";

const meta = {
  title: "Components/Breadcrumb",
  component: Breadcrumb,
  parameters: {
    layout: "centered",
    componentSubtitle: (
      <div>
        <p className="sui-mb-1 sui-text-body">
          A navigation aid that shows the user&apos;s current location within a
          site hierarchy. Compose with sub-components to build flexible
          breadcrumb trails. The current page is not included in the
          breadcrumb&mdash;it normally should be rendered as a page title
          instead.
        </p>
        <p className="sui-mb-1 sui-italic sui-text-caption">
          Click on &quot;Show code&quot; to copy a workable example to your TS
          project.
        </p>
      </div>
    ),
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Default ─────────────────────────────────────────────

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Basic breadcrumb trail ending with a separator. The current page title is normally rendered outside the breadcrumb component.",
      },
    },
  },
  render: (args) => (
    <Breadcrumb {...args}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/teams">Teams</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

// ─── Composition Patterns ────────────────────────────────

export const WithCustomSeparator: Story = {
  name: "With Custom Separator",
  parameters: {
    docs: {
      description: {
        story:
          "Pass custom children to `BreadcrumbSeparator` to replace the default chevron icon. Common alternatives include slashes, arrows, or dots.",
      },
    },
  },
  render: (args) => (
    <Breadcrumb {...args}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="sui-mx-1">/</BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink href="/organizations">Organizations</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="sui-mx-1">/</BreadcrumbSeparator>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

export const WithEllipsis: Story = {
  name: "With Ellipsis",
  parameters: {
    docs: {
      description: {
        story:
          "Use `BreadcrumbEllipsis` to collapse intermediate levels in deep hierarchies. Keeps the breadcrumb compact while preserving key navigation points.",
      },
    },
  },
  render: (args) => (
    <Breadcrumb {...args}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbEllipsis />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/teams/eagles/roster">Roster</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

export const TwoLevels: Story = {
  name: "Two Levels",
  parameters: {
    docs: {
      description: {
        story:
          "Minimal breadcrumb with a single parent link. Useful for shallow page hierarchies.",
      },
    },
  },
  render: (args) => (
    <Breadcrumb {...args}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/settings">Settings</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

export const WithAsChild: Story = {
  name: "With asChild",
  parameters: {
    docs: {
      description: {
        story:
          "Use the `asChild` prop on `BreadcrumbLink` to render a custom element (e.g., a router `Link`) instead of an anchor tag. The custom element receives all breadcrumb link props via Radix Slot.",
      },
    },
  },
  render: (args) => (
    <Breadcrumb {...args}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <a href="/">Home</a>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <a href="/schedule">Schedule</a>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

export const WithDropdown: Story = {
  name: "With Dropdown",
  parameters: {
    docs: {
      description: {
        story:
          "Use a `DropdownMenu` inside `BreadcrumbItem` to let users navigate collapsed intermediate levels. The ellipsis icon triggers a menu listing the hidden pages.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: "15rem" }}>
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <Breadcrumb {...args}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <BreadcrumbEllipsis />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>
                <a href="/organizations">Organizations</a>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <a href="/organizations/northside-sc">Northside SC</a>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <a href="/organizations/northside-sc/teams">Teams</a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/organizations/northside-sc/teams/u12-eagles">
            U12 Eagles
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

// ─── Real-World Example ──────────────────────────────────

export const RealWorldTeamNav: Story = {
  name: "Real-World: Team Management",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "A production-like breadcrumb trail with a page title below. The current page is not part of the breadcrumb — it is rendered as an `h1` heading instead.",
      },
    },
  },
  render: (args) => (
    <div>
      <Breadcrumb {...args}>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/organizations/northside-sc">
              Northside SC
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/organizations/northside-sc/teams">
              Teams
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/organizations/northside-sc/teams/u12-eagles">
              U12 Eagles
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="sui-mt-2 sui-text-heading-lg">Roster</h1>
    </div>
  ),
};
