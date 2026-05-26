import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Organisms/SideNav/Usage Guide",
  parameters: {
    layout: "centered",
    controls: { disabled: true },
    previewTabs: { canvas: { hidden: true } },
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const CodeBlock = ({
  title,
  description,
  code,
}: {
  title: string;
  description: string;
  code: string;
}) => (
  <div className="sui-mb-6">
    <h3 className="sui-text-heading-sm sui-mb-1">{title}</h3>
    <p className="sui-text-body sui-text-neutral-text-weak sui-mb-2">
      {description}
    </p>
    <pre className="sui-bg-neutral-background-weak sui-p-3 sui-rounded-lg sui-overflow-x-auto sui-text-caption">
      <code>{code}</code>
    </pre>
  </div>
);

export const BasicWithReactRouter: Story = {
  name: "Basic with React Router",
  render: () => (
    <div className="sui-max-w-[800px]">
      <CodeBlock
        title="Basic Integration with React Router"
        description="Use the asChild prop on SideNavMenuLink to render your router's NavLink component. This keeps the design system router-agnostic while giving you full routing integration."
        code={`import { NavLink, useLocation } from "react-router-dom";
import {
  SideNav,
  SideNavMenu,
  SideNavMenuList,
  SideNavMenuItem,
  SideNavMenuLink,
  Icon,
} from "@teamsnap/ts-design-system";

function AppSidebar() {
  const location = useLocation();
  const currentPage = location.pathname.split("/")[1];

  return (
    <SideNav variant="expanded">
      <SideNavMenu>
        <SideNavMenuList>
          <SideNavMenuItem value="dashboard">
            <SideNavMenuLink
              variant="expanded"
              variantType="admin"
              active={currentPage === "dashboard"}
              asChild
            >
              <NavLink to="/dashboard">
                <Icon name="view_cozy" />
                Dashboard
              </NavLink>
            </SideNavMenuLink>
          </SideNavMenuItem>
          <SideNavMenuItem value="settings">
            <SideNavMenuLink
              variant="expanded"
              variantType="admin"
              active={currentPage === "settings"}
              asChild
            >
              <NavLink to="/settings">
                <Icon name="settings" />
                Settings
              </NavLink>
            </SideNavMenuLink>
          </SideNavMenuItem>
        </SideNavMenuList>
      </SideNavMenu>
    </SideNav>
  );
}`}
      />
    </div>
  ),
};

export const WithActiveRouteDetection: Story = {
  name: "Active Route Detection",
  render: () => (
    <div className="sui-max-w-[800px]">
      <CodeBlock
        title="Active Route Detection"
        description="For links, pass the active prop to SideNavMenuLink — Radix sets a data-[active] attribute that drives the active styling via CSS. For triggers (parent items with sub-menus), pass the active prop as a CVA variant."
        code={`import { NavLink, useLocation } from "react-router-dom";
import {
  SideNav,
  SideNavMenu,
  SideNavMenuList,
  SideNavMenuItem,
  SideNavMenuLink,
  SideNavMenuTrigger,
  SideNavMenuContent,
  Icon,
} from "@teamsnap/ts-design-system";

function AppSidebar() {
  const location = useLocation();
  const segments = location.pathname.split("/");
  const firstLevel = segments[3] ?? "";   // e.g., "communicate"
  const secondLevel = segments[4] ?? "";  // e.g., "chat"

  return (
    <SideNav variant="expanded">
      <SideNavMenu>
        <SideNavMenuList>
          {/* Simple link — active when on this route */}
          <SideNavMenuItem value="dashboard">
            <SideNavMenuLink
              variant="expanded"
              active={firstLevel === "dashboard"}
              asChild
            >
              <NavLink to="/org/123/dashboard">
                <Icon name="view_cozy" /> Dashboard
              </NavLink>
            </SideNavMenuLink>
          </SideNavMenuItem>

          {/* Trigger with sub-menu — active when any child is active */}
          <SideNavMenuItem value="communicate">
            <SideNavMenuTrigger
              variant="expanded"
              active={firstLevel === "communicate"}
              onPointerMove={(e) => e.preventDefault()}
              onPointerLeave={(e) => e.preventDefault()}
            >
              <Icon name="forum" /> Communicate
            </SideNavMenuTrigger>
            <SideNavMenuContent
              variant="expanded"
              onPointerMove={(e) => e.preventDefault()}
              onPointerLeave={(e) => e.preventDefault()}
            >
              <SideNavMenuLink
                variant="expanded"
                subItem
                active={secondLevel === "messages"}
                asChild
              >
                <NavLink to="/org/123/communicate/messages">
                  Messages
                </NavLink>
              </SideNavMenuLink>
              <SideNavMenuLink
                variant="expanded"
                subItem
                active={secondLevel === "chat"}
                asChild
              >
                <NavLink to="/org/123/communicate/chat">
                  Chat
                </NavLink>
              </SideNavMenuLink>
            </SideNavMenuContent>
          </SideNavMenuItem>
        </SideNavMenuList>
      </SideNavMenu>
    </SideNav>
  );
}`}
      />
    </div>
  ),
};

export const FullAdminSidebar: Story = {
  name: "Full Admin Sidebar",
  render: () => (
    <div className="sui-max-w-[800px]">
      <CodeBlock
        title="Full Admin Sidebar"
        description="A complete admin sidebar with header, toggle, navigation items, sub-menus, badges, and footer. This pattern mirrors the org-frontend's MainNavigation."
        code={`import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
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
  Icon,
  useTwBreakpoint,
  useIsTouchDevice,
} from "@teamsnap/ts-design-system";

function AdminSidebar() {
  const { isLg } = useTwBreakpoint("lg");
  const isTouchDevice = useIsTouchDevice();
  const [expanded, setExpanded] = useState(isLg);
  const location = useLocation();
  const variant = expanded ? "expanded" : "collapsed";

  const firstLevel = location.pathname.split("/")[3] ?? "";

  return (
    <SideNav variant={variant}>
      <SideNavToggle
        expanded={expanded}
        onToggle={() => setExpanded(!expanded)}
        isTouchDevice={isTouchDevice}
      />
      <SideNavHeader>
        <div className="sui-px-3 sui-pt-5 sui-mb-3">
          <OrganizationSwitcher variant={variant} />
        </div>
      </SideNavHeader>
      <SideNavMenu>
        <SideNavMenuList>
          <SideNavMenuItem value="dashboard">
            <SideNavMenuLink
              variant={variant}
              variantType="admin"
              active={firstLevel === "dashboard"}
              asChild
            >
              <NavLink to="/org/123/dashboard">
                <Icon name="view_cozy" />
                {expanded && "Dashboard"}
              </NavLink>
            </SideNavMenuLink>
          </SideNavMenuItem>

          <SideNavMenuItem value="communicate">
            <SideNavMenuTrigger
              variant={variant}
              variantType="admin"
              active={firstLevel === "communicate"}
              onPointerMove={(e) => e.preventDefault()}
              onPointerLeave={(e) => e.preventDefault()}
            >
              <Icon name="forum" />
              {expanded && "Communicate"}
            </SideNavMenuTrigger>
            <SideNavMenuContent variant={variant}>
              <SideNavMenuLink
                variant={variant}
                variantType="admin"
                subItem
                asChild
              >
                <NavLink to="/org/123/communicate/messages">
                  Messages
                </NavLink>
              </SideNavMenuLink>
              <SideNavMenuLink
                variant={variant}
                variantType="admin"
                subItem
                asChild
              >
                <NavLink to="/org/123/communicate/chat">
                  Chat
                  <SideNavBadge>3</SideNavBadge>
                </NavLink>
              </SideNavMenuLink>
            </SideNavMenuContent>
          </SideNavMenuItem>
        </SideNavMenuList>
      </SideNavMenu>
      <SideNavFooter>
        <div className="sui-p-4">
          <img src="/images/logo.svg" alt="Logo" />
        </div>
      </SideNavFooter>
    </SideNav>
  );
}`}
      />
    </div>
  ),
};

export const ConsumerSidebar: Story = {
  name: "Consumer Sidebar",
  render: () => (
    <div className="sui-max-w-[800px]">
      <CodeBlock
        title="Consumer Sidebar"
        description='A consumer-facing sidebar using variantType="consumer" for green active states instead of the admin blue. Ideal for end-user-facing apps like identity-frontend.'
        code={`import { NavLink, useLocation } from "react-router-dom";
import {
  SideNav,
  SideNavHeader,
  SideNavMenu,
  SideNavMenuList,
  SideNavMenuItem,
  SideNavMenuLink,
  Icon,
} from "@teamsnap/ts-design-system";

function ConsumerSidebar() {
  const location = useLocation();
  const currentPage = location.pathname.split("/")[1];

  return (
    <SideNav variant="expanded">
      <SideNavHeader>
        <div className="sui-px-3 sui-pt-5 sui-mb-3">
          <div className="sui-text-label-lg sui-font-semibold">
            TeamSnap
          </div>
        </div>
      </SideNavHeader>
      <SideNavMenu>
        <SideNavMenuList>
          <SideNavMenuItem value="profile">
            <SideNavMenuLink
              variant="expanded"
              variantType="consumer"
              active={currentPage === "profile"}
              asChild
            >
              <NavLink to="/profile">
                <Icon name="person" /> Profile
              </NavLink>
            </SideNavMenuLink>
          </SideNavMenuItem>
          <SideNavMenuItem value="registrations">
            <SideNavMenuLink
              variant="expanded"
              variantType="consumer"
              active={currentPage === "registrations"}
              asChild
            >
              <NavLink to="/registrations">
                <Icon name="app_registration" /> Registrations
              </NavLink>
            </SideNavMenuLink>
          </SideNavMenuItem>
          <SideNavMenuItem value="invoices">
            <SideNavMenuLink
              variant="expanded"
              variantType="consumer"
              active={currentPage === "invoices"}
              asChild
            >
              <NavLink to="/invoices">
                <Icon name="receipt_long" /> Invoices
              </NavLink>
            </SideNavMenuLink>
          </SideNavMenuItem>
          <SideNavMenuItem value="settings">
            <SideNavMenuLink
              variant="expanded"
              variantType="consumer"
              active={currentPage === "settings"}
              asChild
            >
              <NavLink to="/settings">
                <Icon name="settings" /> Settings
              </NavLink>
            </SideNavMenuLink>
          </SideNavMenuItem>
        </SideNavMenuList>
      </SideNavMenu>
    </SideNav>
  );
}`}
      />
    </div>
  ),
};
