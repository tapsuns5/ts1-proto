import { fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom";
import Tabs from "./Tabs";
import { TabsProps } from "./Tabs.types";

describe("Tabs", () => {
  it("should display items", () => {
    let props: TabsProps = {
      ariaLabel: "Tabs List",
      defaultValue: "tab1",
      tabs: [
        {
          label: "Tab 1",
          value: "tab1",
          content: <p>Tab 1 Content</p>,
        },
        {
          label: "Tab 2",
          value: "tab2",
          content: <p>Tab 2 Content</p>,
        },
      ],
      onChange: () => {},
    };
    const { getByTestId } = render(<Tabs {...props} />);
    const Tabs_component = getByTestId("tabs-component");
    const Tabs_tablist = getByTestId("tabs-component__tab-list");
    expect(Tabs_component).toHaveTextContent("Tab 1");
    expect(Tabs_component).toHaveTextContent("Tab 2");
    expect(Tabs_component).toHaveTextContent("Tab 1 Content");
    expect(Tabs_tablist).toHaveAttribute("aria-label", "Tabs List");
  });

  it("should display correct content with tab is clicked", async () => {
    let props: TabsProps = {
      ariaLabel: "Tabs List",
      onChange: () => {},
      tabs: [
        {
          label: "Tab 1",
          value: "tab1",
          content: <p>Tab 1 Content</p>,
        },
        {
          label: "Tab 2",
          value: "tab2",
          content: <p>Tab 2 Content</p>,
        },
      ],
    };
    const { getByTestId } = render(<Tabs {...props} />);
    const Tabs_trigger = getByTestId("tabs-component__tab-trigger-tab2");
    expect(Tabs_trigger).toHaveTextContent("Tab 2");

    fireEvent(
      Tabs_trigger,
      new MouseEvent("mousedown", {
        bubbles: true,
      }),
    );

    const Tabs_content = getByTestId("tabs-component__tab-content-tab2");
    expect(Tabs_content).toHaveTextContent("Tab 2 Content");
  });

  it("should default to admin variant and have admin classes", () => {
    const props: TabsProps = {
      ariaLabel: "Tabs List",
      defaultValue: "tab1",
      tabs: [
        { label: "Tab 1", value: "tab1", content: <p>Tab 1 Content</p> },
        { label: "Tab 2", value: "tab2", content: <p>Tab 2 Content</p> },
      ],
      onChange: () => {},
    };
    const { getByTestId } = render(<Tabs {...props} />);
    const trigger = getByTestId("tabs-component__tab-trigger-tab1");
    // Should have admin border/text classes
    expect(trigger.className).toMatch(/sui-border-admin-action-border/);
    expect(trigger.className).toMatch(/sui-text-admin-action-text/);
  });

  it("should use consumer variant and have consumer classes", () => {
    const props: TabsProps = {
      ariaLabel: "Tabs List",
      defaultValue: "tab1",
      variantType: "consumer",
      tabs: [
        { label: "Tab 1", value: "tab1", content: <p>Tab 1 Content</p> },
        { label: "Tab 2", value: "tab2", content: <p>Tab 2 Content</p> },
      ],
      onChange: () => {},
    };
    const { getByTestId } = render(<Tabs {...props} />);
    const trigger = getByTestId("tabs-component__tab-trigger-tab1");
    // Should have consumer border/text classes
    expect(trigger.className).toMatch(/sui-border-consumer-action-border/);
    expect(trigger.className).toMatch(/sui-text-neutral-text-medium/);
  });

  it("should call onTabClick when a tab is clicked", () => {
    const mockOnTabClick = jest.fn();
    const props: TabsProps = {
      ariaLabel: "Tabs List",
      defaultValue: "tab1",
      tabs: [
        { label: "Tab 1", value: "tab1", content: <p>Tab 1 Content</p> },
        { label: "Tab 2", value: "tab2", content: <p>Tab 2 Content</p> },
      ],
      onChange: () => {},
      onTabClick: mockOnTabClick,
    };
    const { getByTestId } = render(<Tabs {...props} />);
    const trigger = getByTestId("tabs-component__tab-trigger-tab2");

    fireEvent.click(trigger);

    expect(mockOnTabClick).toHaveBeenCalledWith("tab2");
    expect(mockOnTabClick).toHaveBeenCalledTimes(1);
  });
});
