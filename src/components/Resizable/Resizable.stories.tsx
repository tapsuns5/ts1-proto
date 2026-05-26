import type { Meta, StoryObj } from "@storybook/react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../../index";

const meta = {
  title: "Components/Resizable",
  component: ResizablePanelGroup,
  parameters: {
    layout: "padded",
    componentSubtitle: (
      <div>
        <p className="sui-mb-1 sui-text-body">
          A set of resizable panel components for building adjustable layouts.
          Panels can be arranged horizontally or vertically with draggable
          handles between them.
        </p>
        <div className="sui-mb-2 sui-grid">
          <a
            href="https://github.com/bvaughn/react-resizable-panels"
            target="_blank"
            rel="noreferrer"
            className="sui-text-body"
          >
            react-resizable-panels API Reference
          </a>
        </div>
        <p className="sui-mb-1 sui-italic sui-text-caption">
          Click on &quot;Show code&quot; to copy a workable example to your TS
          project.
        </p>
      </div>
    ),
  },
  decorators: [
    (Story) => (
      <div style={{ height: "300px", width: "100%" }}>
        <Story />
      </div>
    ),
  ],
  args: {
    direction: "horizontal",
  },
  argTypes: {
    direction: {
      control: "radio",
      options: ["horizontal", "vertical"],
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ResizablePanelGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Default ─────────────────────────────────────────────

export const Default: Story = {
  render: (args) => (
    <ResizablePanelGroup {...args}>
      <ResizablePanel defaultSize={30} minSize={20}>
        <div className="sui-flex sui-h-full sui-items-center sui-justify-center sui-rounded-l sui-bg-neutral-background-weak sui-p-3">
          <span className="sui-text-label sui-text-neutral-text-weak">
            Sidebar
          </span>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={70} minSize={30}>
        <div className="sui-flex sui-h-full sui-items-center sui-justify-center sui-rounded-r sui-bg-neutral-background sui-p-3">
          <span className="sui-text-label sui-text-neutral-text-weak">
            Main Content
          </span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};

// ─── With Handle ─────────────────────────────────────────

export const WithHandle: Story = {
  name: "With Handle",
  parameters: {
    docs: {
      description: {
        story:
          "Pass `withHandle` to `ResizableHandle` to show a visible drag grip icon. This provides a clearer affordance for resizing.",
      },
    },
  },
  render: (args) => (
    <ResizablePanelGroup {...args}>
      <ResizablePanel defaultSize={30} minSize={20}>
        <div className="sui-flex sui-h-full sui-items-center sui-justify-center sui-rounded-l sui-bg-neutral-background-weak sui-p-3">
          <span className="sui-text-label sui-text-neutral-text-weak">
            Panel A
          </span>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={70} minSize={30}>
        <div className="sui-flex sui-h-full sui-items-center sui-justify-center sui-rounded-r sui-bg-neutral-background sui-p-3">
          <span className="sui-text-label sui-text-neutral-text-weak">
            Panel B
          </span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};

// ─── Vertical ────────────────────────────────────────────

export const Vertical: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Set `direction="vertical"` on `ResizablePanelGroup` to stack panels top-to-bottom instead of side-by-side.',
      },
    },
  },
  args: {
    direction: "vertical",
  },
  render: (args) => (
    <ResizablePanelGroup {...args}>
      <ResizablePanel defaultSize={40} minSize={20}>
        <div className="sui-flex sui-h-full sui-items-center sui-justify-center sui-rounded-t sui-bg-neutral-background-weak sui-p-3">
          <span className="sui-text-label sui-text-neutral-text-weak">
            Top Panel
          </span>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={60} minSize={20}>
        <div className="sui-flex sui-h-full sui-items-center sui-justify-center sui-rounded-b sui-bg-neutral-background sui-p-3">
          <span className="sui-text-label sui-text-neutral-text-weak">
            Bottom Panel
          </span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};

// ─── Three Panels ────────────────────────────────────────

export const ThreePanels: Story = {
  name: "Three Panels",
  parameters: {
    docs: {
      description: {
        story:
          "Multiple panels can be arranged by alternating `ResizablePanel` and `ResizableHandle` components within a group.",
      },
    },
  },
  render: (args) => (
    <ResizablePanelGroup {...args}>
      <ResizablePanel defaultSize={25} minSize={15}>
        <div className="sui-flex sui-h-full sui-items-center sui-justify-center sui-rounded-l sui-bg-neutral-background-weak sui-p-3">
          <span className="sui-text-label sui-text-neutral-text-weak">
            Navigation
          </span>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50} minSize={25}>
        <div className="sui-flex sui-h-full sui-items-center sui-justify-center sui-bg-neutral-background sui-p-3">
          <span className="sui-text-label sui-text-neutral-text-weak">
            Content
          </span>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={25} minSize={15}>
        <div className="sui-flex sui-h-full sui-items-center sui-justify-center sui-rounded-r sui-bg-neutral-background-weak sui-p-3">
          <span className="sui-text-label sui-text-neutral-text-weak">
            Details
          </span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};

// ─── Nested ──────────────────────────────────────────────

export const Nested: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Panel groups can be nested to create complex layouts — for example, a horizontal split with a vertical split inside one of the panels.",
      },
    },
  },
  render: (args) => (
    <ResizablePanelGroup {...args}>
      <ResizablePanel defaultSize={30} minSize={20}>
        <div className="sui-flex sui-h-full sui-items-center sui-justify-center sui-rounded-l sui-bg-neutral-background-weak sui-p-3">
          <span className="sui-text-label sui-text-neutral-text-weak">
            Sidebar
          </span>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={70} minSize={30}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={60} minSize={20}>
            <div className="sui-flex sui-h-full sui-items-center sui-justify-center sui-rounded-tr sui-bg-neutral-background sui-p-3">
              <span className="sui-text-label sui-text-neutral-text-weak">
                Editor
              </span>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={40} minSize={15}>
            <div className="sui-flex sui-h-full sui-items-center sui-justify-center sui-rounded-br sui-bg-neutral-background sui-p-3">
              <span className="sui-text-label sui-text-neutral-text-weak">
                Terminal
              </span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};

// ─── Real-World Example ──────────────────────────────────

export const RealWorldMailLayout: Story = {
  name: "Real-World: Mail Layout",
  parameters: {
    docs: {
      description: {
        story:
          "A production-like email client layout with a folder sidebar, message list, and reading pane.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{ height: "400px", width: "100%" }}
        className="sui-rounded sui-border sui-border-neutral-border"
      >
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <ResizablePanelGroup {...args}>
      <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
        <div className="sui-flex sui-h-full sui-flex-col sui-gap-1 sui-p-2">
          <p className="sui-text-label sui-font-semibold">Folders</p>
          {["Inbox (12)", "Sent", "Drafts (3)", "Archive"].map((folder) => (
            <p
              key={folder}
              className="sui-cursor-pointer sui-rounded sui-px-2 sui-py-1 sui-text-label-sm hover:sui-bg-neutral-background-weak"
            >
              {folder}
            </p>
          ))}
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={35} minSize={25}>
        <div className="sui-flex sui-h-full sui-flex-col sui-overflow-auto">
          {[
            {
              from: "Coach Williams",
              subject: "Practice schedule update",
              preview: "Hi team, we need to move Thursday's practice...",
            },
            {
              from: "Tournament Director",
              subject: "Spring Classic bracket",
              preview: "The bracket for the Spring Classic has been...",
            },
            {
              from: "Parent Committee",
              subject: "Fundraiser recap",
              preview: "Great news! We raised $2,400 at Saturday's...",
            },
          ].map((msg) => (
            <div
              key={msg.subject}
              className="sui-cursor-pointer sui-border-b sui-border-neutral-border sui-p-2 hover:sui-bg-neutral-background-weak"
            >
              <p className="sui-text-label sui-font-semibold">{msg.from}</p>
              <p className="sui-text-label-sm">{msg.subject}</p>
              <p className="sui-text-caption sui-text-neutral-text-weak">
                {msg.preview}
              </p>
            </div>
          ))}
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={45} minSize={30}>
        <div className="sui-flex sui-h-full sui-flex-col sui-p-3">
          <p className="sui-text-heading-sm">Practice schedule update</p>
          <p className="sui-text-caption sui-text-neutral-text-weak">
            From: Coach Williams &mdash; Mar 24, 2026
          </p>
          <div className="sui-mt-3 sui-text-body">
            <p>Hi team,</p>
            <p className="sui-mt-2">
              We need to move Thursday&apos;s practice to 5:30 PM due to field
              maintenance. Please update your calendars and let me know if this
              causes any conflicts.
            </p>
            <p className="sui-mt-2">See you on the field!</p>
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};
