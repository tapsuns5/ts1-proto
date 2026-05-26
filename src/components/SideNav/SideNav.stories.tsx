import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  SideNav,
  SideNavHeader,
  SideNavMenu,
  SideNavMenuList,
  SideNavMenuItem,
  SideNavMenuLink,
  SideNavMenuTrigger,
  SideNavMenuContent,
  SideNavBadge,
  SideNavFooter,
  SideNavToggle,
} from "./SideNav";
import Icon from "../Icon/Icon";

const meta = {
  title: "Organisms/SideNav",
  component: SideNav,
  parameters: {
    layout: "fullscreen",
    componentSubtitle:
      "A compound sidebar navigation component built on Radix NavigationMenu primitives.",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/iNstL3nTw7jLPyL7uH4jLK/%F0%9F%92%BB-%F0%9F%9F%A3-Web-App-%E2%80%94-Base-Components-%E2%80%94-TS1?node-id=13058-29955&m=dev",
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SideNav>;

export default meta;
type Story = StoryObj<typeof meta>;

const SampleNavItems = ({
  variant = "expanded",
  variantType = "admin",
}: {
  variant?: "expanded" | "collapsed";
  variantType?: "admin" | "consumer";
}) => (
  <SideNavMenu>
    <SideNavMenuList>
      <SideNavMenuItem value="dashboard">
        <SideNavMenuLink
          href="#"
          variant={variant}
          variantType={variantType}
          active
        >
          <Icon name="view_cozy" />
          {variant === "expanded" && "Dashboard"}
        </SideNavMenuLink>
      </SideNavMenuItem>
      <SideNavMenuItem value="schedule">
        <SideNavMenuLink href="#" variant={variant} variantType={variantType}>
          <Icon name="calendar_today" />
          {variant === "expanded" && "Schedule"}
        </SideNavMenuLink>
      </SideNavMenuItem>
      <SideNavMenuItem value="communicate">
        <SideNavMenuTrigger
          variant={variant}
          variantType={variantType}
          active={false}
          onPointerMove={(e) => e.preventDefault()}
          onPointerLeave={(e) => e.preventDefault()}
        >
          <Icon name="forum" />
          {variant === "expanded" && "Communicate"}
        </SideNavMenuTrigger>
        <SideNavMenuContent
          variant={variant}
          onPointerMove={(e) => e.preventDefault()}
          onPointerLeave={(e) => e.preventDefault()}
        >
          <SideNavMenuLink
            href="#"
            variant={variant}
            variantType={variantType}
            subItem
          >
            Messages
          </SideNavMenuLink>
          <SideNavMenuLink
            href="#"
            variant={variant}
            variantType={variantType}
            subItem
          >
            Chat
            <SideNavBadge>3</SideNavBadge>
          </SideNavMenuLink>
        </SideNavMenuContent>
      </SideNavMenuItem>
      <SideNavMenuItem value="members">
        <SideNavMenuLink href="#" variant={variant} variantType={variantType}>
          <Icon name="groups" />
          {variant === "expanded" && "Members"}
        </SideNavMenuLink>
      </SideNavMenuItem>
      <SideNavMenuItem value="settings">
        <SideNavMenuLink href="#" variant={variant} variantType={variantType}>
          <Icon name="settings" />
          {variant === "expanded" && "Settings"}
        </SideNavMenuLink>
      </SideNavMenuItem>
    </SideNavMenuList>
  </SideNavMenu>
);

export const ExpandedAdmin: Story = {
  render: () => (
    <SideNav variant="expanded">
      <SideNavHeader>
        <div className="sui-px-3 sui-pt-5 sui-mb-3">
          <div className="sui-bg-white sui-rounded-lg sui-p-2 sui-text-label sui-font-semibold">
            My Organization
          </div>
        </div>
      </SideNavHeader>
      <SampleNavItems variant="expanded" variantType="admin" />
      <SideNavFooter>
        <div className="sui-p-4 sui-text-caption sui-text-neutral-text-weak sui-text-center">
          Powered by TeamSnap
        </div>
      </SideNavFooter>
    </SideNav>
  ),
};

export const CollapsedAdmin: Story = {
  render: () => (
    <SideNav variant="collapsed">
      <SideNavHeader>
        <div className="sui-pt-2 sui-mb-2 sui-grid sui-place-items-center">
          <div className="sui-bg-white sui-rounded-lg sui-p-1 sui-h-5 sui-w-5 sui-grid sui-place-items-center sui-font-bold">
            M
          </div>
        </div>
      </SideNavHeader>
      <SampleNavItems variant="collapsed" variantType="admin" />
      <SideNavFooter>
        <div className="sui-p-2 sui-text-center">
          <Icon name="sports_soccer" className="sui-text-neutral-text-weak" />
        </div>
      </SideNavFooter>
    </SideNav>
  ),
};

export const WithToggle: Story = {
  render: () => {
    const [expanded, setExpanded] = React.useState(true);
    const variant = expanded ? "expanded" : "collapsed";

    return (
      <SideNav variant={variant}>
        <SideNavToggle
          expanded={expanded}
          onToggle={() => setExpanded(!expanded)}
        />
        <SideNavHeader>
          <div className="sui-px-3 sui-pt-5 sui-mb-3">
            {expanded ? (
              <div className="sui-bg-white sui-rounded-lg sui-p-2 sui-text-label sui-font-semibold">
                My Organization
              </div>
            ) : (
              <div className="sui-bg-white sui-rounded-lg sui-p-1 sui-h-5 sui-w-5 sui-grid sui-place-items-center sui-font-bold sui-mx-auto">
                M
              </div>
            )}
          </div>
        </SideNavHeader>
        <SampleNavItems variant={variant} variantType="admin" />
      </SideNav>
    );
  },
};

export const ConsumerVariant: Story = {
  render: () => (
    <SideNav variant="expanded">
      <SideNavHeader>
        <div className="sui-px-3 sui-pt-5 sui-mb-3">
          <div className="sui-text-label-lg sui-font-semibold">TeamSnap</div>
        </div>
      </SideNavHeader>
      <SideNavMenu>
        <SideNavMenuList>
          <SideNavMenuItem value="profile">
            <SideNavMenuLink
              href="#"
              variant="expanded"
              variantType="consumer"
              active
            >
              <Icon name="person" />
              Profile
            </SideNavMenuLink>
          </SideNavMenuItem>
          <SideNavMenuItem value="registrations">
            <SideNavMenuLink
              href="#"
              variant="expanded"
              variantType="consumer"
            >
              <Icon name="app_registration" />
              Registrations
            </SideNavMenuLink>
          </SideNavMenuItem>
          <SideNavMenuItem value="invoices">
            <SideNavMenuLink
              href="#"
              variant="expanded"
              variantType="consumer"
            >
              <Icon name="receipt_long" />
              Invoices
            </SideNavMenuLink>
          </SideNavMenuItem>
          <SideNavMenuItem value="settings">
            <SideNavMenuLink
              href="#"
              variant="expanded"
              variantType="consumer"
            >
              <Icon name="settings" />
              Settings
            </SideNavMenuLink>
          </SideNavMenuItem>
        </SideNavMenuList>
      </SideNavMenu>
    </SideNav>
  ),
};

export const WithSubMenu: Story = {
  render: () => (
    <SideNav variant="expanded">
      <SideNavMenu>
        <SideNavMenuList>
          <SideNavMenuItem value="dashboard">
            <SideNavMenuLink href="#" variant="expanded" active>
              <Icon name="view_cozy" />
              Dashboard
            </SideNavMenuLink>
          </SideNavMenuItem>
          <SideNavMenuItem value="communicate">
            <SideNavMenuTrigger
              variant="expanded"
              active={false}
              onPointerMove={(e) => e.preventDefault()}
              onPointerLeave={(e) => e.preventDefault()}
            >
              <Icon name="forum" />
              Communicate
            </SideNavMenuTrigger>
            <SideNavMenuContent
              variant="expanded"
              onPointerMove={(e) => e.preventDefault()}
              onPointerLeave={(e) => e.preventDefault()}
            >
              <SideNavMenuLink href="#" variant="expanded" subItem>
                Messages
              </SideNavMenuLink>
              <SideNavMenuLink href="#" variant="expanded" subItem active>
                Chat
              </SideNavMenuLink>
              <SideNavMenuLink href="#" variant="expanded" subItem>
                Email
              </SideNavMenuLink>
            </SideNavMenuContent>
          </SideNavMenuItem>
          <SideNavMenuItem value="financials">
            <SideNavMenuTrigger
              variant="expanded"
              active={false}
              onPointerMove={(e) => e.preventDefault()}
              onPointerLeave={(e) => e.preventDefault()}
            >
              <Icon name="payments" />
              Financials
            </SideNavMenuTrigger>
            <SideNavMenuContent
              variant="expanded"
              onPointerMove={(e) => e.preventDefault()}
              onPointerLeave={(e) => e.preventDefault()}
            >
              <SideNavMenuLink href="#" variant="expanded" subItem>
                Transactions
              </SideNavMenuLink>
              <SideNavMenuLink href="#" variant="expanded" subItem>
                Deposits
              </SideNavMenuLink>
            </SideNavMenuContent>
          </SideNavMenuItem>
        </SideNavMenuList>
      </SideNavMenu>
    </SideNav>
  ),
};

export const WithBadge: Story = {
  render: () => (
    <SideNav variant="expanded">
      <SideNavMenu>
        <SideNavMenuList>
          <SideNavMenuItem value="messages">
            <SideNavMenuLink href="#" variant="expanded">
              <Icon name="mail" />
              Messages
              <SideNavBadge>5</SideNavBadge>
            </SideNavMenuLink>
          </SideNavMenuItem>
          <SideNavMenuItem value="chat">
            <SideNavMenuLink href="#" variant="expanded" active>
              <Icon name="forum" />
              Chat
              <SideNavBadge>12</SideNavBadge>
            </SideNavMenuLink>
          </SideNavMenuItem>
          <SideNavMenuItem value="notifications">
            <SideNavMenuLink href="#" variant="expanded">
              <Icon name="notifications" />
              Notifications
              <SideNavBadge>99+</SideNavBadge>
            </SideNavMenuLink>
          </SideNavMenuItem>
        </SideNavMenuList>
      </SideNavMenu>
    </SideNav>
  ),
};

export const WithAsChild: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates the `asChild` pattern. When `asChild` is true, the link renders as the child element instead of the default anchor. In a real app, you'd pass a router `NavLink` as the child.",
      },
    },
  },
  render: () => (
    <SideNav variant="expanded">
      <SideNavMenu>
        <SideNavMenuList>
          <SideNavMenuItem value="profile">
            <SideNavMenuLink variant="expanded" active asChild>
              <a href="#profile">
                <Icon name="person" />
                Profile (asChild anchor)
              </a>
            </SideNavMenuLink>
          </SideNavMenuItem>
          <SideNavMenuItem value="settings">
            <SideNavMenuLink variant="expanded" asChild>
              <a href="#settings">
                <Icon name="settings" />
                Settings (asChild anchor)
              </a>
            </SideNavMenuLink>
          </SideNavMenuItem>
        </SideNavMenuList>
      </SideNavMenu>
    </SideNav>
  ),
};
