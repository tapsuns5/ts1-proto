import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./Dialog";

const renderDialog = (
  contentProps: React.ComponentProps<typeof DialogContent> = {},
  dialogProps: React.ComponentProps<typeof Dialog> = {},
) =>
  render(
    <Dialog open {...dialogProps}>
      <DialogContent {...contentProps}>
        <DialogHeader>
          <DialogTitle>My Title</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <DialogDescription>My description</DialogDescription>
        </DialogBody>
        <DialogFooter>
          <button type="button">OK</button>
        </DialogFooter>
      </DialogContent>
    </Dialog>,
  );

describe("Dialog", () => {
  it("renders title, body, and footer content when open", () => {
    renderDialog();
    expect(screen.getByText("My Title")).toBeInTheDocument();
    expect(screen.getByText("My description")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "OK" })).toBeInTheDocument();
  });

  it("renders the default close icon button", () => {
    renderDialog();
    expect(
      screen.getByRole("button", { name: "Close dialog" }),
    ).toBeInTheDocument();
  });

  it("hides the close icon button when showCloseIconButton is false", () => {
    renderDialog({ showCloseIconButton: false });
    expect(
      screen.queryByRole("button", { name: "Close dialog" }),
    ).not.toBeInTheDocument();
  });

  it("calls onOpenChange(false) when the close button is clicked", () => {
    const onOpenChange = jest.fn();
    renderDialog({}, { onOpenChange });
    fireEvent.click(screen.getByRole("button", { name: "Close dialog" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  describe("scrollable prop", () => {
    it("nests Content inside Overlay by default (scrollable=true)", () => {
      renderDialog();
      const content = screen.getByRole("dialog");
      // Content's direct parent is the overlay (a fixed positioned container
      // with inset-0 styles).
      const parent = content.parentElement;
      expect(parent).not.toBeNull();
      expect(parent?.className).toContain("sui-fixed");
      expect(parent?.className).toContain("sui-inset-0");
    });

    it("renders Content as a sibling of Overlay when scrollable=false", () => {
      renderDialog({ scrollable: false });
      const content = screen.getByRole("dialog");
      const parent = content.parentElement;
      expect(parent).not.toBeNull();
      // Parent should NOT be the overlay — overlay class markers must be absent.
      expect(parent?.className || "").not.toContain("sui-inset-0");
      // Overlay still renders as a sibling of Content within the portal.
      const overlay = parent?.querySelector(".sui-inset-0");
      expect(overlay).not.toBeNull();
      expect(overlay).not.toBe(content);
    });
  });
});
