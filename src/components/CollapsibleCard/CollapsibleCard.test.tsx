import "@testing-library/jest-dom";
import { fireEvent, render, screen, within } from "@testing-library/react";
import {
  CollapsibleCard,
  CollapsibleCardContent,
  CollapsibleCardHeader,
} from "./CollapsibleCard";

describe("CollapsibleCard", () => {
  it("renders the header and content", () => {
    render(
      <CollapsibleCard defaultOpen>
        <CollapsibleCardHeader title="Header" />
        <CollapsibleCardContent>Content</CollapsibleCardContent>
      </CollapsibleCard>,
    );

    const root = screen.getByTestId("collapsible-card-root");
    const header = within(root).getByTestId("collapsible-card-header");
    expect(header).toBeInTheDocument();
    expect(within(header).getByText("Header")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("renders the header with custom children", () => {
    render(
      <CollapsibleCard>
        <CollapsibleCardHeader>
          <div>
            Custom Header
            <button>Click Me</button>
          </div>
        </CollapsibleCardHeader>
        <CollapsibleCardContent>Content</CollapsibleCardContent>
      </CollapsibleCard>,
    );

    const header = screen.getByTestId("collapsible-card-header");
    expect(within(header).getByText("Custom Header")).toBeInTheDocument();
    expect(
      within(header).getByRole("button", { name: "Click Me" }),
    ).toBeInTheDocument();
  });

  it("can be open by default", () => {
    render(
      <CollapsibleCard defaultOpen>
        <CollapsibleCardHeader title="Header" />
        <CollapsibleCardContent>Content</CollapsibleCardContent>
      </CollapsibleCard>,
    );

    expect(screen.getByText("Content")).toBeVisible();
  });

  it("toggles content on header click", () => {
    render(
      <CollapsibleCard>
        <CollapsibleCardHeader title="Header" />
        <CollapsibleCardContent>Content</CollapsibleCardContent>
      </CollapsibleCard>,
    );

    fireEvent.click(screen.getByTestId("collapsible-card-header"));
    expect(screen.getByText("Content")).toBeVisible();
  });

  it("calls onOpenChange when toggled", () => {
    const onOpenChange = jest.fn();
    render(
      <CollapsibleCard onOpenChange={onOpenChange}>
        <CollapsibleCardHeader title="Header" />
        <CollapsibleCardContent>Content</CollapsibleCardContent>
      </CollapsibleCard>,
    );

    fireEvent.click(screen.getByTestId("collapsible-card-header"));
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    fireEvent.click(screen.getByTestId("collapsible-card-header"));
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it("hides trigger icon when showTriggerIcon is false", () => {
    render(
      <CollapsibleCard>
        <CollapsibleCardHeader title="Header" showTriggerIcon={false} />
        <CollapsibleCardContent>Content</CollapsibleCardContent>
      </CollapsibleCard>,
    );

    const header = screen.getByTestId("collapsible-card-header");
    expect(header.querySelector(".material-symbols-rounded")).toBeNull();
  });

  it("shows trigger icon by default", () => {
    render(
      <CollapsibleCard>
        <CollapsibleCardHeader title="Header" />
        <CollapsibleCardContent>Content</CollapsibleCardContent>
      </CollapsibleCard>,
    );

    const header = screen.getByTestId("collapsible-card-header");
    expect(
      header.querySelector(".material-symbols-rounded"),
    ).toBeInTheDocument();
  });

  it("respects controlled open prop", () => {
    const { rerender } = render(
      <CollapsibleCard open>
        <CollapsibleCardHeader title="Header" />
        <CollapsibleCardContent>Content</CollapsibleCardContent>
      </CollapsibleCard>,
    );
    expect(screen.getByText("Content")).toBeVisible();

    rerender(
      <CollapsibleCard open={false}>
        <CollapsibleCardHeader title="Header" />
        <CollapsibleCardContent>Content</CollapsibleCardContent>
      </CollapsibleCard>,
    );
    expect(screen.getByTestId("collapsible-card-content")).toHaveStyle(
      "grid-template-rows: 0fr",
    );
  });
});
