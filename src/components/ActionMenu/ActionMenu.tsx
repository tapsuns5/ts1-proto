import * as Popover from "@radix-ui/react-popover";
import React from "react";
import Icon from "../Icon/Icon";
import classes from "./ActionMenu.module.scss";
import { ActionMenuProps } from "./ActionMenu.types";

const alignMap: Record<string, "start" | "end" | "center"> = {
  left: "start",
  right: "end",
  center: "center",
};

/**
 * Secondary description on Storybook Docs. I can have multiple lines and
   bullets!
  - The primary component has:
    - CSS modules
    - Tailwind styles
    - CSS variables
  - To make sure all different CSS channels are working
  */
const ActionMenu: React.FC<ActionMenuProps> = ({
  align = "left", // Set a default
  actions = [],
  onClose = () => {},
  className = "",
  trigger,
  isOpen,
  ...props
}) => {
  return (
    <Popover.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}>
      {trigger ? (
        <Popover.Trigger asChild>{trigger}</Popover.Trigger>
      ) : (
        <Popover.Anchor
          style={{
            display: "inline-block", // Create an inline block for positioning
            width: "0px",
            height: "0px",
          }}>
          <div data-testid={"action-menu-anchor"} />
        </Popover.Anchor>
      )}
      <Popover.Portal>
        <Popover.Content
          side={"bottom"}
          avoidCollisions
          onOpenAutoFocus={(e) => e.preventDefault()}
          align={align ? alignMap[align] : "end"}>
          <div
            data-testid="action-menu-component"
            className={[
              classes["ActionMenu"],
              classes[`ActionMenu--${align}`],
              className,
            ].join(" ")}
            {...props}>
            {actions.map((action, index) => (
              <Popover.Close asChild key={index}>
                <button
                  className={[
                    classes["ActionMenu__Button"],
                    classes[
                      `ActionMenu__Button--${action.sentiment || "default"}`
                    ],
                  ].join(" ")}
                  disabled={action.disabled}
                  onClick={action.onClick}>
                  {action.icon && <Icon name={action.icon} />}
                  {action.label}
                </button>
              </Popover.Close>
            ))}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default ActionMenu;
