import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type ReactElement,
  type ReactNode,
} from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "../../utils";
import Icon from "../Icon/Icon";
import IconButton from "../IconButton/IconButton";
import styles from "./Toast.module.scss";
import { useToast } from "./useToast";

type ToastPosition = "top-right" | "bottom-center";

const Toast = forwardRef<
  ElementRef<typeof ToastPrimitives.Root>,
  ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants> & {
      description?: ReactNode;
      action?: ReactElement<typeof ToastAction>;
      position?: ToastPosition;
    }
>(
  (
    {
      className,
      title,
      description,
      children,
      action,
      variant = "info",
      position = "top-right",
      ...props
    },
    ref,
  ) => {
    const animationClass =
      position === "bottom-center"
        ? styles.toastEntranceAnimationBottom
        : styles.toastEntranceAnimation;

    return (
      <ToastPrimitives.Root
        ref={ref}
        className={cn(
          toastVariants({ variant, position }),
          animationClass,
          className,
        )}
        {...props}
      >
        <div
          className={cn(toastIconWrapperStyles, {
            "sui-py-0": position === "bottom-center",
          })}
        >
          {ICON_PER_VARIANT[variant ?? "info"]}
        </div>
        <div
          className={cn(
            "sui-flex sui-flex-1 sui-flex-col sui-justify-center sui-px-1 sui-py-2",
            {
              "sui-py-0": position === "bottom-center",
            },
          )}
        >
          <ToastPrimitives.Title asChild>
            <div className="!sui-font-bold sui-text-body">{title}</div>
          </ToastPrimitives.Title>
          {Boolean(description) && (
            <ToastPrimitives.Description asChild>
              <div className="sui-text-neutral-text-medium sui-text-body">
                {description}
              </div>
            </ToastPrimitives.Description>
          )}
          {children}
        </div>
        {Boolean(action) && action}
        <div
          className={cn("sui-flex sui-flex-col sui-justify-center sui-p-1", {
            "sui-py-0.5": position === "bottom-center",
          })}
        >
          <ToastPrimitives.Close toast-close="" asChild>
            <IconButton icon="close" size="compact" />
          </ToastPrimitives.Close>
        </div>
      </ToastPrimitives.Root>
    );
  },
);
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = forwardRef<
  ElementRef<typeof ToastPrimitives.Action>,
  ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className="sui-cursor-pointer sui-border-0 sui-bg-white sui-text-desktop-4 sui-font-semibold sui-text-action-text hover:sui-text-action-text-hover active:sui-text-action-text-pressed"
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

type ToastProps = ComponentPropsWithoutRef<typeof Toast>;
type ToastActionElement = ReactElement<typeof ToastAction>;

const ToastProvider = ({
  position = "top-right",
  className,
}: {
  position?: ToastPosition;
  className?: string;
}): React.ReactElement => {
  const { toasts } = useToast();

  // Filter toasts to only show ones for this position
  const positionToasts = toasts.filter(
    (toast) => (toast.position || "top-right") === position,
  );

  return (
    <ToastPrimitives.Provider>
      {positionToasts.map(({ id, title, description, action, ...props }) => (
        <Toast
          key={id}
          title={title}
          description={description}
          action={action}
          position={position}
          {...props}
        />
      ))}
      <ToastPrimitives.Viewport
        className={cn(getToastViewportStyles(position), className)}
      />
    </ToastPrimitives.Provider>
  );
};

export {
  ToastProvider,
  type ToastProps,
  type ToastActionElement,
  type ToastPosition,
  ToastAction,
  useToast,
};

const ICON_PER_VARIANT = {
  info: <Icon name="info" />,
  success: <Icon name="check_circle" />,
  warning: <Icon name="warning" />,
  negative: <Icon name="report" />,
};

const toastVariants = cva(
  [
    "sui-group sui-flex sui-items-stretch sui-border sui-bg-white sui-shadow-up [overflow:hidden]",
    "sui-absolute sui-w-[calc(100%-2rem)] [transition:all_0.2s_ease-in-out]",
  ],
  {
    variants: {
      variant: {
        info: "snap-ui-toast-info sui-border-info-border",
        success: "snap-ui-toast-success sui-border-positive-border",
        warning: "snap-ui-toast-warning sui-border-caution-border",
        negative: "snap-ui-toast-negative sui-border-negative-border",
      },
      position: {
        "top-right": "sui-rounded",
        "bottom-center": "sui-rounded-full",
      },
    },
    defaultVariants: {
      variant: "info",
      position: "top-right",
    },
  },
);

const toastIconWrapperStyles = [
  "sui-px-1 sui-py-2 sui-flex sui-flex-col sui-justify-center",
  "group-[.snap-ui-toast-info]:sui-bg-info-background-medium group-[.snap-ui-toast-info]:sui-text-neutral-icon",
  "group-[.snap-ui-toast-success]:sui-bg-positive-background group-[.snap-ui-toast-success]:sui-text-neutral-icon",
  "group-[.snap-ui-toast-warning]:sui-bg-caution-background group-[.snap-ui-toast-warning]:sui-text-neutral-icon",
  "group-[.snap-ui-toast-negative]:sui-bg-negative-background-weak group-[.snap-ui-toast-negative]:sui-text-neutral-icon",
];

const getToastViewportStyles = (position: ToastPosition): string[] => {
  const baseStyles = [
    "sui-fixed sui-z-[1001] sui-flex sui-w-full sui-flex-col sui-p-2 sui-max-w-[478px]",
  ];

  const positionStyles = {
    "top-right": [
      "[top:0] [right:0]",
      // Top-down stacking animation for top-right
      "[&>li]:[top:12px] [&>li]:[scale:0.96]",
      "[&>li:nth-last-child(2)]:[top:20px] [&>li:nth-last-child(2)]:[scale:0.98]",
      "[&>li:last-child]:[top:28px] [&>li:last-child]:[scale:1]",
    ],
    "bottom-center": [
      "[bottom:0] [left:50%] [transform:translateX(-50%)]",
      // Bottom-up stacking animation for bottom-center - stack upward from bottom
      "[&>li]:[bottom:44px] [&>li]:[scale:0.96]",
      "[&>li:nth-last-child(2)]:[bottom:38px] [&>li:nth-last-child(2)]:[scale:0.98]",
      "[&>li:last-child]:[bottom:32px] [&>li:last-child]:[scale:1]",
    ],
  };

  return [...baseStyles, ...positionStyles[position]];
};
