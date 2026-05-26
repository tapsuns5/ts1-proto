import type { Meta, StoryObj } from "@storybook/react";
import {
  LabelButton,
  ToastAction,
  ToastProvider,
  useToast,
  type ToastPosition,
} from "../../index";
import { ToastActionElement } from "./Toast";

const meta = {
  title: "Components/Toast",
  // Although we use ToastTrigger in stories, ToastProvider is the core setup component.
  component: ToastProvider,
  parameters: {
    componentSubtitle: "A component to display brief, temporary notifications.",
  },
  // Every story needs the ToastProvider to function.
  decorators: [
    (Story) => (
      <div className="sui-flex sui-min-h-[500px] sui-items-center sui-justify-center">
        <Story />
        <ToastProvider />
      </div>
    ),
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof ToastProvider>;

export default meta;
type Story = StoryObj<typeof ToastTrigger>;

export const Info: Story = {
  args: {
    variant: "info",
    title: "This is an info toast",
    buttonText: "Info Toast",
  },
  render: (args) => <ToastTrigger {...args} />,
};

export const Success: Story = {
  args: {
    variant: "success",
    title: "This is a success toast",
    buttonText: "Success Toast",
  },
  render: (args) => <ToastTrigger {...args} />,
};

export const Warning: Story = {
  args: {
    variant: "warning",
    title: "This is a warning toast",
    buttonText: "Warning Toast",
  },
  render: (args) => <ToastTrigger {...args} />,
};

export const Negative: Story = {
  args: {
    variant: "negative",
    title: "This is a negative toast",
    description: "Something went wrong, please try again.",
    action: <ToastAction altText="Try again">Retry</ToastAction>,
    buttonText: "Negative Toast",
  },
  render: (args) => <ToastTrigger {...args} />,
};

export const BottomCenter: Story = {
  args: {
    variant: "success",
    title: "Alessandra was added to the team",
    buttonText: "Bottom Center Toast",
    position: "bottom-center",
  },
  render: (args) => <ToastTrigger {...args} />,
  decorators: [
    (Story) => (
      <div className="sui-flex sui-min-h-[500px] sui-items-center sui-justify-center">
        <Story />
        <ToastProvider position="bottom-center" />
      </div>
    ),
  ],
};

export const MultiplePositions: Story = {
  render: () => (
    <div className="sui-flex sui-min-h-[500px] sui-items-center sui-justify-center sui-gap-4">
      <ToastTrigger
        variant="info"
        title="Top right toast"
        buttonText="Show Top Right"
        position="top-right"
      />
      <ToastTrigger
        variant="success"
        title="Bottom center toast"
        buttonText="Show Bottom Center"
        position="bottom-center"
      />
    </div>
  ),
  decorators: [
    (Story) => (
      <div>
        <Story />
        <ToastProvider position="top-right" />
        <ToastProvider position="bottom-center" />
      </div>
    ),
  ],
};

export const WithCustomStyling: Story = {
  args: {
    variant: "warning",
    title: "Custom positioned toast",
    buttonText: "Show Custom Toast",
    position: "bottom-center",
  },
  render: (args) => <ToastTrigger {...args} />,
  decorators: [
    (Story) => (
      <div className="sui-relative sui-flex sui-min-h-[500px] sui-items-center sui-justify-center">
        {/* Simulate left navigation */}
        <div className="sui-w-48 sui-bg-gray-200 sui-fixed sui-bottom-0 sui-left-0 sui-top-0 sui-flex sui-items-center sui-justify-center">
          <span className="sui-text-sm">Left Nav</span>
        </div>
        <div className="sui-ml-48 sui-flex sui-flex-1 sui-items-center sui-justify-center">
          <Story />
        </div>
        <ToastProvider
          position="bottom-center"
          className="sui-left-48 sui-w-[calc(100%-12rem)]"
        />
      </div>
    ),
  ],
};

export const WithLinkInDescription: Story = {
  render: () => {
    const { toast } = useToast();
    return (
      <LabelButton
        labelText="Show Toast with Link"
        onClick={() => {
          toast({
            variant: "info",
            title: "Action required",
            description: (
              <>
                Please review the changes in your settings.{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    console.log("Link clicked!");
                  }}
                  className="sui-font-semibold sui-underline hover:sui-opacity-80"
                >
                  View details
                </a>
              </>
            ),
          });
        }}
      />
    );
  },
};

export const WithAction: Story = {
  render: () => {
    const { toast } = useToast();
    return (
      <LabelButton
        labelText="Show Toast with Action"
        onClick={() => {
          toast({
            variant: "info",
            title: "File deleted",
            description: "Your file has been permanently deleted",
            action: (
              <ToastAction
                altText="Undo deletion"
                onClick={() => {
                  console.log("Undo clicked!");
                  toast({
                    variant: "success",
                    title: "Action undone",
                    description: "Your file has been restored",
                  });
                }}
              >
                Undo
              </ToastAction>
            ),
          });
        }}
      />
    );
  },
};

const ToastTrigger = ({
  variant,
  title,
  description,
  action,
  buttonText,
  position,
}: {
  variant: "info" | "success" | "warning" | "negative";
  title: string;
  description?: string;
  action?: ToastActionElement;
  buttonText: string;
  position?: ToastPosition;
}) => {
  const { toast } = useToast();
  return (
    <LabelButton
      labelText={buttonText}
      onClick={() => {
        toast({
          variant,
          title,
          description,
          position,
          ...(action && { action }),
        });
      }}
    />
  );
};
