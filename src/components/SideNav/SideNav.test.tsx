import "@testing-library/jest-dom";
import { render, fireEvent } from "@testing-library/react";
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

const renderSideNav = ({
  variant = "expanded",
  variantType = "admin",
}: {
  variant?: "expanded" | "collapsed";
  variantType?: "admin" | "consumer";
} = {}) =>
  render(
    <SideNav data-testid="side-nav" variant={variant}>
      <SideNavHeader data-testid="header">
        <span>Header</span>
      </SideNavHeader>
      <SideNavMenu data-testid="menu">
        <SideNavMenuList data-testid="menu-list">
          <SideNavMenuItem data-testid="menu-item" value="home">
            <SideNavMenuLink
              data-testid="menu-link"
              href="/home"
              variant={variant}
              variantType={variantType}
            >
              Home
            </SideNavMenuLink>
          </SideNavMenuItem>
        </SideNavMenuList>
      </SideNavMenu>
      <SideNavFooter data-testid="footer">
        <span>Footer</span>
      </SideNavFooter>
    </SideNav>,
  );

describe("SideNav", () => {
  describe("rendering", () => {
    it("renders with data-slot attributes", () => {
      const { getByTestId } = renderSideNav();
      expect(getByTestId("side-nav")).toHaveAttribute(
        "data-slot",
        "side-nav",
      );
      expect(getByTestId("header")).toHaveAttribute(
        "data-slot",
        "side-nav-header",
      );
      expect(getByTestId("footer")).toHaveAttribute(
        "data-slot",
        "side-nav-footer",
      );
      expect(getByTestId("menu-item")).toHaveAttribute(
        "data-slot",
        "side-nav-menu-item",
      );
      expect(getByTestId("menu-link")).toHaveAttribute(
        "data-slot",
        "side-nav-menu-link",
      );
    });

    it("renders header and footer children", () => {
      const { getByText } = renderSideNav();
      expect(getByText("Header")).toBeInTheDocument();
      expect(getByText("Footer")).toBeInTheDocument();
    });

    it("renders link children", () => {
      const { getByText } = renderSideNav();
      expect(getByText("Home")).toBeInTheDocument();
    });
  });

  describe("SideNav variants", () => {
    it("applies expanded width class by default", () => {
      const { getByTestId } = renderSideNav();
      expect(getByTestId("side-nav").className).toMatch(/sui-w-\[250px\]/);
    });

    it("applies collapsed width class", () => {
      const { getByTestId } = renderSideNav({ variant: "collapsed" });
      expect(getByTestId("side-nav").className).toMatch(/sui-w-\[88px\]/);
    });

    it("applies base classes", () => {
      const { getByTestId } = renderSideNav();
      const el = getByTestId("side-nav");
      expect(el.className).toMatch(/sui-bg-neutral-background-weak/);
      expect(el.className).toMatch(/sui-h-screen/);
      expect(el.className).toMatch(/sui-flex sui-flex-col/);
    });

    it("merges custom className", () => {
      const { getByTestId } = render(
        <SideNav data-testid="nav" className="custom-class" />,
      );
      expect(getByTestId("nav").className).toMatch(/custom-class/);
      expect(getByTestId("nav").className).toMatch(/sui-w-\[250px\]/);
    });
  });

  describe("SideNavMenuLink variants", () => {
    it("applies expanded link classes", () => {
      const { getByTestId } = render(
        <SideNavMenu>
          <SideNavMenuList>
            <SideNavMenuItem value="test">
              <SideNavMenuLink
                data-testid="link"
                href="#"
                variant="expanded"
              >
                Test
              </SideNavMenuLink>
            </SideNavMenuItem>
          </SideNavMenuList>
        </SideNavMenu>,
      );
      const link = getByTestId("link");
      expect(link.className).toMatch(/sui-flex sui-items-center sui-gap-2/);
      expect(link.className).toMatch(/sui-font-semibold/);
    });

    it("applies collapsed link classes", () => {
      const { getByTestId } = render(
        <SideNavMenu>
          <SideNavMenuList>
            <SideNavMenuItem value="test">
              <SideNavMenuLink
                data-testid="link"
                href="#"
                variant="collapsed"
              >
                Test
              </SideNavMenuLink>
            </SideNavMenuItem>
          </SideNavMenuList>
        </SideNavMenu>,
      );
      const link = getByTestId("link");
      expect(link.className).toMatch(/sui-grid sui-place-items-center/);
    });

    it("applies subItem indent class for expanded", () => {
      const { getByTestId } = render(
        <SideNavMenu>
          <SideNavMenuList>
            <SideNavMenuItem value="test">
              <SideNavMenuLink
                data-testid="link"
                href="#"
                variant="expanded"
                subItem
              >
                Sub
              </SideNavMenuLink>
            </SideNavMenuItem>
          </SideNavMenuList>
        </SideNavMenu>,
      );
      expect(getByTestId("link").className).toMatch(/sui-pl-8/);
    });

    it("applies admin active color classes", () => {
      const { getByTestId } = render(
        <SideNavMenu>
          <SideNavMenuList>
            <SideNavMenuItem value="test">
              <SideNavMenuLink
                data-testid="link"
                href="#"
                variant="expanded"
                variantType="admin"
                active
              >
                Test
              </SideNavMenuLink>
            </SideNavMenuItem>
          </SideNavMenuList>
        </SideNavMenu>,
      );
      expect(getByTestId("link").className).toMatch(
        /sui-bg-accent-background/,
      );
      expect(getByTestId("link").className).toMatch(
        /hover:sui-bg-accent-background-hover/,
      );
    });

    it("applies consumer active color classes", () => {
      const { getByTestId } = render(
        <SideNavMenu>
          <SideNavMenuList>
            <SideNavMenuItem value="test">
              <SideNavMenuLink
                data-testid="link"
                href="#"
                variant="expanded"
                variantType="consumer"
                active
              >
                Test
              </SideNavMenuLink>
            </SideNavMenuItem>
          </SideNavMenuList>
        </SideNavMenu>,
      );
      expect(getByTestId("link").className).toMatch(
        /sui-bg-consumer-action-background/,
      );
      expect(getByTestId("link").className).toMatch(
        /hover:sui-bg-consumer-action-background-hover/,
      );
    });

    it("merges custom className on link", () => {
      const { getByTestId } = render(
        <SideNavMenu>
          <SideNavMenuList>
            <SideNavMenuItem value="test">
              <SideNavMenuLink
                data-testid="link"
                href="#"
                variant="expanded"
                className="my-custom"
              >
                Test
              </SideNavMenuLink>
            </SideNavMenuItem>
          </SideNavMenuList>
        </SideNavMenu>,
      );
      expect(getByTestId("link").className).toMatch(/my-custom/);
    });
  });

  describe("SideNavMenuTrigger variants", () => {
    it("applies expanded trigger classes", () => {
      const { getByText } = render(
        <SideNavMenu>
          <SideNavMenuList>
            <SideNavMenuItem value="test">
              <SideNavMenuTrigger variant="expanded">
                Trigger
              </SideNavMenuTrigger>
              <SideNavMenuContent variant="expanded">Content</SideNavMenuContent>
            </SideNavMenuItem>
          </SideNavMenuList>
        </SideNavMenu>,
      );
      const trigger = getByText("Trigger").closest("button")!;
      expect(trigger.className).toMatch(/sui-flex sui-items-center sui-gap-2/);
      expect(trigger.className).toMatch(/sui-font-semibold/);
    });

    it("applies collapsed trigger classes", () => {
      const { getByText } = render(
        <SideNavMenu>
          <SideNavMenuList>
            <SideNavMenuItem value="test">
              <SideNavMenuTrigger variant="collapsed">
                Trigger
              </SideNavMenuTrigger>
              <SideNavMenuContent variant="collapsed">
                Content
              </SideNavMenuContent>
            </SideNavMenuItem>
          </SideNavMenuList>
        </SideNavMenu>,
      );
      const trigger = getByText("Trigger").closest("button")!;
      expect(trigger.className).toMatch(/sui-grid sui-place-items-center/);
    });

    it("applies admin active classes when expanded", () => {
      const { getByText } = render(
        <SideNavMenu>
          <SideNavMenuList>
            <SideNavMenuItem value="test">
              <SideNavMenuTrigger
                variant="expanded"
                variantType="admin"
                active
              >
                Trigger
              </SideNavMenuTrigger>
              <SideNavMenuContent variant="expanded">Content</SideNavMenuContent>
            </SideNavMenuItem>
          </SideNavMenuList>
        </SideNavMenu>,
      );
      const trigger = getByText("Trigger").closest("button")!;
      expect(trigger.className).toMatch(/sui-bg-accent-background/);
      expect(trigger.className).toMatch(/sui-text-white/);
    });

    it("applies consumer active classes when expanded", () => {
      const { getByText } = render(
        <SideNavMenu>
          <SideNavMenuList>
            <SideNavMenuItem value="test">
              <SideNavMenuTrigger
                variant="expanded"
                variantType="consumer"
                active
              >
                Trigger
              </SideNavMenuTrigger>
              <SideNavMenuContent variant="expanded">Content</SideNavMenuContent>
            </SideNavMenuItem>
          </SideNavMenuList>
        </SideNavMenu>,
      );
      const trigger = getByText("Trigger").closest("button")!;
      expect(trigger.className).toMatch(/sui-bg-consumer-action-background/);
      expect(trigger.className).toMatch(/sui-text-white/);
    });

    it("renders chevron icon in expanded mode", () => {
      const { getByText } = render(
        <SideNavMenu>
          <SideNavMenuList>
            <SideNavMenuItem value="test">
              <SideNavMenuTrigger variant="expanded">
                Trigger
              </SideNavMenuTrigger>
              <SideNavMenuContent variant="expanded">Content</SideNavMenuContent>
            </SideNavMenuItem>
          </SideNavMenuList>
        </SideNavMenu>,
      );
      const trigger = getByText("Trigger").closest("button")!;
      const icon = trigger.querySelector(".material-symbols-rounded");
      expect(icon).toBeInTheDocument();
    });

    it("does not render chevron icon in collapsed mode", () => {
      const { getByText } = render(
        <SideNavMenu>
          <SideNavMenuList>
            <SideNavMenuItem value="test">
              <SideNavMenuTrigger variant="collapsed">
                Trigger
              </SideNavMenuTrigger>
              <SideNavMenuContent variant="collapsed">
                Content
              </SideNavMenuContent>
            </SideNavMenuItem>
          </SideNavMenuList>
        </SideNavMenu>,
      );
      const trigger = getByText("Trigger").closest("button")!;
      const icon = trigger.querySelector(".material-symbols-rounded");
      expect(icon).not.toBeInTheDocument();
    });
  });

  describe("SideNavMenuContent variants", () => {
    it("applies expanded content classes when trigger is opened", () => {
      const { getByTestId, getByText } = render(
        <SideNavMenu>
          <SideNavMenuList>
            <SideNavMenuItem value="test">
              <SideNavMenuTrigger variant="expanded">
                Trigger
              </SideNavMenuTrigger>
              <SideNavMenuContent data-testid="content" variant="expanded">
                Content
              </SideNavMenuContent>
            </SideNavMenuItem>
          </SideNavMenuList>
        </SideNavMenu>,
      );
      fireEvent.click(getByText("Trigger"));
      const content = getByTestId("content");
      expect(content.className).toMatch(/sui-grid sui-gap-1 sui-pt-1/);
    });

    it("applies collapsed content classes when trigger is opened", () => {
      const { getByTestId, getByText } = render(
        <SideNavMenu>
          <SideNavMenuList>
            <SideNavMenuItem value="test">
              <SideNavMenuTrigger variant="collapsed">
                Trigger
              </SideNavMenuTrigger>
              <SideNavMenuContent data-testid="content" variant="collapsed">
                Content
              </SideNavMenuContent>
            </SideNavMenuItem>
          </SideNavMenuList>
        </SideNavMenu>,
      );
      fireEvent.click(getByText("Trigger"));
      const content = getByTestId("content");
      expect(content.className).toMatch(/sui-absolute/);
      expect(content.className).toMatch(/sui-rounded-lg/);
    });
  });

  describe("SideNavBadge", () => {
    it("renders with content", () => {
      const { getByTestId } = render(
        <SideNavBadge data-testid="badge">5</SideNavBadge>,
      );
      expect(getByTestId("badge")).toHaveTextContent("5");
    });

    it("has badge styling classes", () => {
      const { getByTestId } = render(
        <SideNavBadge data-testid="badge">5</SideNavBadge>,
      );
      const badge = getByTestId("badge");
      expect(badge.className).toMatch(/sui-rounded-full/);
      expect(badge.className).toMatch(/sui-bg-accent-background/);
    });

    it("has active-parent styling classes", () => {
      const { getByTestId } = render(
        <SideNavBadge data-testid="badge">5</SideNavBadge>,
      );
      expect(getByTestId("badge").className).toMatch(
        /group-data-\[active\]:sui-bg-white/,
      );
    });
  });

  describe("SideNavToggle", () => {
    it("calls onToggle when clicked", () => {
      const onToggle = jest.fn();
      const { getByTestId } = render(
        <SideNavToggle
          data-testid="toggle"
          expanded={true}
          onToggle={onToggle}
        />,
      );
      fireEvent.click(getByTestId("toggle"));
      expect(onToggle).toHaveBeenCalledTimes(1);
    });

    it("has type=button", () => {
      const { getByTestId } = render(
        <SideNavToggle
          data-testid="toggle"
          expanded={true}
          onToggle={jest.fn()}
        />,
      );
      expect(getByTestId("toggle")).toHaveAttribute("type", "button");
    });

    it("applies hover visibility classes when expanded", () => {
      const { getByTestId } = render(
        <SideNavToggle
          data-testid="toggle"
          expanded={true}
          onToggle={jest.fn()}
        />,
      );
      expect(getByTestId("toggle").className).toMatch(/sui-opacity-0/);
      expect(getByTestId("toggle").className).toMatch(
        /group-hover:sui-opacity-100/,
      );
    });

    it("has aria-expanded=true when expanded", () => {
      const { getByTestId } = render(
        <SideNavToggle
          data-testid="toggle"
          expanded={true}
          onToggle={jest.fn()}
        />,
      );
      expect(getByTestId("toggle")).toHaveAttribute("aria-expanded", "true");
      expect(getByTestId("toggle")).toHaveAttribute(
        "aria-label",
        "Collapse sidebar",
      );
    });

    it("has aria-expanded=false when collapsed", () => {
      const { getByTestId } = render(
        <SideNavToggle
          data-testid="toggle"
          expanded={false}
          onToggle={jest.fn()}
        />,
      );
      expect(getByTestId("toggle")).toHaveAttribute("aria-expanded", "false");
      expect(getByTestId("toggle")).toHaveAttribute(
        "aria-label",
        "Expand sidebar",
      );
    });

    it("shows toggle always when collapsed", () => {
      const { getByTestId } = render(
        <SideNavToggle
          data-testid="toggle"
          expanded={false}
          onToggle={jest.fn()}
        />,
      );
      expect(getByTestId("toggle").className).toMatch(/sui-grid/);
      expect(getByTestId("toggle").className).not.toMatch(/sui-opacity-0/);
    });
  });

  describe("SideNavMenuItem", () => {
    it("has sui-relative class for popout positioning", () => {
      const { getByTestId } = render(
        <SideNavMenu>
          <SideNavMenuList>
            <SideNavMenuItem data-testid="item" value="test">
              <SideNavMenuLink href="#">Test</SideNavMenuLink>
            </SideNavMenuItem>
          </SideNavMenuList>
        </SideNavMenu>,
      );
      expect(getByTestId("item").className).toMatch(/sui-relative/);
    });
  });

  describe("accessibility", () => {
    it("SideNavMenu renders as nav element", () => {
      const { container } = render(
        <SideNavMenu data-testid="menu">
          <SideNavMenuList>
            <SideNavMenuItem value="test">
              <SideNavMenuLink href="#">Test</SideNavMenuLink>
            </SideNavMenuItem>
          </SideNavMenuList>
        </SideNavMenu>,
      );
      expect(container.querySelector("nav")).toBeInTheDocument();
    });

    it("SideNavMenuList renders as ul element", () => {
      const { container } = render(
        <SideNavMenu>
          <SideNavMenuList data-testid="list">
            <SideNavMenuItem value="test">
              <SideNavMenuLink href="#">Test</SideNavMenuLink>
            </SideNavMenuItem>
          </SideNavMenuList>
        </SideNavMenu>,
      );
      expect(container.querySelector("ul")).toBeInTheDocument();
    });

    it("SideNavMenuItem renders as li element", () => {
      const { container } = render(
        <SideNavMenu>
          <SideNavMenuList>
            <SideNavMenuItem value="test">
              <SideNavMenuLink href="#">Test</SideNavMenuLink>
            </SideNavMenuItem>
          </SideNavMenuList>
        </SideNavMenu>,
      );
      expect(container.querySelector("li")).toBeInTheDocument();
    });
  });
});
