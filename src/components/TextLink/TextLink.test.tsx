import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { TextLink } from "./TextLink";

describe("TextLink", () => {
  it("renders as an anchor when href is provided", () => {
    render(
      <TextLink href="/test" data-testid="link">
        Click me
      </TextLink>,
    );
    const el = screen.getByTestId("link");
    expect(el.tagName).toBe("A");
    expect(el).toHaveAttribute("href", "/test");
  });

  it("renders as a button when no href", () => {
    render(<TextLink data-testid="link">Click me</TextLink>);
    const el = screen.getByTestId("link");
    expect(el.tagName).toBe("BUTTON");
    expect(el).toHaveAttribute("type", "button");
  });

  it("renders children", () => {
    render(<TextLink data-testid="link">Hello World</TextLink>);
    expect(screen.getByTestId("link")).toHaveTextContent("Hello World");
  });

  it("defaults to primary variant", () => {
    render(<TextLink data-testid="link">Link</TextLink>);
    expect(screen.getByTestId("link").className).toMatch(
      /sui-text-admin-action-text/,
    );
  });

  it("supports secondary variant", () => {
    render(
      <TextLink data-testid="link" variantType="secondary">
        Link
      </TextLink>,
    );
    expect(screen.getByTestId("link").className).toMatch(
      /sui-text-neutral-text/,
    );
  });

  it("supports negative sentiment", () => {
    render(
      <TextLink data-testid="link" sentiment="negative">
        Link
      </TextLink>,
    );
    expect(screen.getByTestId("link").className).toMatch(
      /sui-text-negative-text/,
    );
  });

  it("supports success sentiment", () => {
    render(
      <TextLink data-testid="link" sentiment="success">
        Link
      </TextLink>,
    );
    expect(screen.getByTestId("link").className).toMatch(
      /sui-text-positive-text/,
    );
  });

  it("disabled anchor has aria-disabled and no href", () => {
    const handleClick = jest.fn();
    render(
      <TextLink href="/test" data-testid="link" disabled onClick={handleClick}>
        Link
      </TextLink>,
    );
    const el = screen.getByTestId("link");
    expect(el.className).toMatch(/sui-text-neutral-text-disabled/);
    expect(el).toHaveAttribute("aria-disabled", "true");
    expect(el).not.toHaveAttribute("href");
    fireEvent.click(el);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("disabled button has disabled attribute", () => {
    render(
      <TextLink data-testid="link" disabled>
        Link
      </TextLink>,
    );
    const el = screen.getByTestId("link");
    expect(el).toBeDisabled();
    expect(el.className).toMatch(/sui-text-neutral-text-disabled/);
  });

  it("renders icon on the left by default", () => {
    render(
      <TextLink data-testid="link" icon="add">
        Add item
      </TextLink>,
    );
    const el = screen.getByTestId("link");
    const icon = el.querySelector("[data-testid='icon-component']");
    expect(icon).toBeInTheDocument();
    expect(el.firstChild).toBe(icon);
  });

  it("renders icon on the right", () => {
    render(
      <TextLink data-testid="link" icon="open_in_new" iconPosition="right">
        Open link
      </TextLink>,
    );
    const el = screen.getByTestId("link");
    const icon = el.querySelector("[data-testid='icon-component']");
    expect(icon).toBeInTheDocument();
    expect(el.lastChild).toBe(icon);
  });

  it("omits icon when prop is not set", () => {
    render(<TextLink data-testid="link">Link</TextLink>);
    const icon = screen
      .getByTestId("link")
      .querySelector("[data-testid='icon-component']");
    expect(icon).not.toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = { current: null } as React.MutableRefObject<HTMLButtonElement | null>;
    render(<TextLink ref={ref}>Link</TextLink>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("merges custom className", () => {
    render(
      <TextLink data-testid="link" className="my-custom-class">
        Link
      </TextLink>,
    );
    expect(screen.getByTestId("link").className).toMatch(/my-custom-class/);
  });

  it("passes through additional HTML attributes", () => {
    render(
      <TextLink data-testid="link" aria-label="custom label">
        Link
      </TextLink>,
    );
    expect(screen.getByTestId("link")).toHaveAttribute(
      "aria-label",
      "custom label",
    );
  });
});
