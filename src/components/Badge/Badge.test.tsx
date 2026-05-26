import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import Badge from "./Badge";

describe("Badge", () => {
  it("should display labelText", () => {
    const { getByTestId } = render(
      <Badge
        data-testid="badge-component"
        variant="neutral"
        labelText="Good Job"
      />,
    );
    const badge = getByTestId("badge-component");
    expect(badge).toHaveTextContent("Good Job");
  });

  it("applies the correct variant class", () => {
    const { getByTestId } = render(
      <Badge
        data-testid="badge-component"
        variant="positive"
        labelText="Success"
      />,
    );
    const badge = getByTestId("badge-component");
    expect(badge.className).toMatch(/sui-bg-positive-background/);
  });

  it("supports custom className", () => {
    const { getByTestId } = render(
      <Badge
        data-testid="badge-component"
        variant="neutral"
        labelText="Custom"
        className="custom-class"
      />,
    );
    const badge = getByTestId("badge-component");
    expect(badge.className).toMatch(/custom-class/);
  });
});
