import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { RichTextDisplay } from "./RichTextDisplay";

describe("RichTextDisplay", () => {
  it("renders HTML content", () => {
    render(<RichTextDisplay html="<p>Hello world</p>" />);
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  it("applies the ts-rich-text-display class", () => {
    const { container } = render(<RichTextDisplay html="<p>Content</p>" />);
    expect(container.firstChild).toHaveClass("ts-rich-text-display");
  });

  it("merges custom className", () => {
    const { container } = render(
      <RichTextDisplay className="sui-mt-4" html="<p>Content</p>" />,
    );
    expect(container.firstChild).toHaveClass("ts-rich-text-display");
    expect(container.firstChild).toHaveClass("sui-mt-4");
  });

  it("forwards ref", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<RichTextDisplay ref={ref} html="<p>Content</p>" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("spreads additional props", () => {
    render(
      <RichTextDisplay
        data-testid="rich-text"
        aria-label="Rich content"
        html="<p>Content</p>"
      />,
    );
    const el = screen.getByTestId("rich-text");
    expect(el).toHaveAttribute("aria-label", "Rich content");
  });

  it("sanitizes HTML by default", () => {
    const { container } = render(
      <RichTextDisplay html='<p>Safe</p><script>alert("xss")</script>' />,
    );
    expect(container.firstChild).toHaveTextContent("Safe");
    expect(container.innerHTML).not.toContain("<script>");
  });

  it("preserves target attribute on links during sanitization", () => {
    const { container } = render(
      <RichTextDisplay html='<a href="https://example.com" target="_blank">Link</a>' />,
    );
    const link = container.querySelector("a");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("skips sanitization when sanitize is false", () => {
    const { container } = render(
      <RichTextDisplay
        sanitize={false}
        html='<p>Content</p><iframe src="https://example.com"></iframe>'
      />,
    );
    expect(container.innerHTML).toContain("<iframe");
  });
});
