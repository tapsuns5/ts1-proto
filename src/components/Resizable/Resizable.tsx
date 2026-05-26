import * as React from "react";
import * as ResizablePrimitive from "react-resizable-panels";
import { GroupProps } from "react-resizable-panels";
import { Icon } from "../assets/Icons";
import { cn } from "../../utils";

const ResizablePanelGroup: React.ForwardRefExoticComponent<
  GroupProps & React.RefAttributes<any>
> = React.forwardRef<any, GroupProps>(({ className, ...props }, ref) => (
  <ResizablePrimitive.Group
    className={cn(
      "sui-flex sui-h-full sui-w-full data-[panel-group-direction=vertical]:sui-flex-col",
      className,
    )}
    {...props}
  />
));
ResizablePanelGroup.displayName = "ResizablePanelGroup";

const ResizablePanel = ResizablePrimitive.Panel;

const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof ResizablePrimitive.Panel> & {
  withHandle?: boolean;
}) => (
  <ResizablePrimitive.Panel
    className={cn(
      [
        "sui-relative sui-flex sui-w-2 sui-items-center sui-justify-center",
        "after:sui-absolute after:sui-inset-y-0 after:sui-left-1/2 after:sui-w-px after:sui--translate-x-1/2 after:sui-bg-neutral-border",
        "focus-visible:sui-ring-admin-action-border focus-visible:sui-outline-none focus-visible:sui-ring-1 focus-visible:sui-ring-offset-1",
        "data-[panel-group-direction=horizontal]:sui-my-3",
        "data-[panel-group-direction=vertical]:sui-mx-3 data-[panel-group-direction=vertical]:sui-h-px data-[panel-group-direction=vertical]:sui-w-full",
        "data-[panel-group-direction=vertical]:after:sui-left-0 data-[panel-group-direction=vertical]:after:sui-h-1 data-[panel-group-direction=vertical]:after:sui-w-full data-[panel-group-direction=vertical]:after:sui--translate-y-1/2 data-[panel-group-direction=vertical]:after:sui-translate-x-0",
        "[&[data-panel-group-direction=vertical]>div]:sui-rotate-90",
      ],
      className,
    )}
    {...props}
  >
    {withHandle && (
      <div className="sui-z-10 sui-flex sui-h-4 sui-w-2 sui-items-center sui-justify-center sui-rounded-sm sui-bg-neutral-background-medium sui-py-1 sui-text-neutral-icon-weak">
        <Icon name="MoreHoriz" aria-label="Handle to resize panel" />
      </div>
    )}
  </ResizablePrimitive.Panel>
);
ResizableHandle.displayName = "ResizableHandle";

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
