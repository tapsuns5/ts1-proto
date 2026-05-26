import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  LabelButton,
  Select,
} from "../../index";

const meta = {
  title: "Components/Dialog",
  component: Dialog,
  parameters: {
    layout: "centered",
    componentSubtitle: (
      <div>
        <p className="sui-mb-1 sui-text-body">
          A modal overlay that focuses the user on a specific task or piece of
          information. Use dialogs for confirmations, forms, and content that
          requires attention before the user can continue.
        </p>
        <div className="sui-mb-2 sui-grid">
          <a
            href="https://www.radix-ui.com/primitives/docs/components/dialog"
            target="_blank"
            rel="noreferrer"
            className="sui-text-body"
          >
            Dialog API Reference
          </a>
        </div>
        <p className="sui-mb-1 sui-italic sui-text-caption">
          Click on &quot;Show code&quot; to copy a workable example to your TS
          project.
        </p>
      </div>
    ),
    design: {
      type: "figma",
      url: "https://www.figma.com/file/B9YbaCM1s3RdIe9kLCLRcu/",
    },
  },
  args: {
    onOpenChange: fn(),
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Default ─────────────────────────────────────────────

export const Default: Story = {
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger asChild>
        <LabelButton labelText="Open Dialog" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Action</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <DialogDescription>
            Are you sure you want to proceed? This action cannot be undone.
          </DialogDescription>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <LabelButton variantType="secondary" labelText="Cancel" />
          </DialogClose>
          <LabelButton variantType="primary" labelText="Confirm" />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

// ─── Sizes ───────────────────────────────────────────────

export const Small: Story = {
  name: "Size: Small",
  parameters: {
    docs: {
      description: {
        story:
          "A compact dialog suited for quick confirmations or single-action prompts.",
      },
    },
  },
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger asChild>
        <LabelButton labelText="Small Dialog" variantType="secondary" />
      </DialogTrigger>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>Rename Division</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <DialogDescription>
            Enter a new name for this division.
          </DialogDescription>
          <div className="sui-mt-2">
            <Input type="text" label="Division Name" name="division_name" />
          </div>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <LabelButton variantType="secondary" labelText="Cancel" />
          </DialogClose>
          <LabelButton variantType="primary" labelText="Save" />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const Medium: Story = {
  name: "Size: Medium (Default)",
  parameters: {
    docs: {
      description: {
        story:
          "The default dialog size. Suitable for most confirmation and form dialogs.",
      },
    },
  },
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger asChild>
        <LabelButton labelText="Medium Dialog" variantType="secondary" />
      </DialogTrigger>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>Update Team Name</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <DialogDescription>
            Enter a new name for your team. This will update the name across all
            schedules and rosters.
          </DialogDescription>
          <div className="sui-mt-2">
            <Input type="text" label="Team Name" name="team_name" />
          </div>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <LabelButton variantType="secondary" labelText="Cancel" />
          </DialogClose>
          <LabelButton variantType="primary" labelText="Save" />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const Large: Story = {
  name: "Size: Large",
  parameters: {
    docs: {
      description: {
        story:
          "A wide dialog for content-heavy views like schedules, tables, or multi-column forms.",
      },
    },
  },
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger asChild>
        <LabelButton labelText="Large Dialog" variantType="secondary" />
      </DialogTrigger>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Season Schedule</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <DialogDescription>
            Review and confirm the upcoming season schedule for your team.
          </DialogDescription>
          <div className="sui-mt-2 sui-flex sui-flex-col sui-gap-1">
            <div className="sui-flex sui-justify-between sui-rounded sui-bg-neutral-background-weak sui-p-2">
              <span>Week 1 &mdash; Mar 15</span>
              <span className="sui-text-neutral-text-weak">vs Eagles</span>
            </div>
            <div className="sui-flex sui-justify-between sui-rounded sui-bg-neutral-background-weak sui-p-2">
              <span>Week 2 &mdash; Mar 22</span>
              <span className="sui-text-neutral-text-weak">vs Hawks</span>
            </div>
            <div className="sui-flex sui-justify-between sui-rounded sui-bg-neutral-background-weak sui-p-2">
              <span>Week 3 &mdash; Mar 29</span>
              <span className="sui-text-neutral-text-weak">vs Lions</span>
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <LabelButton variantType="secondary" labelText="Cancel" />
          </DialogClose>
          <LabelButton variantType="primary" labelText="Publish Schedule" />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const Full: Story = {
  name: "Size: Full",
  parameters: {
    docs: {
      description: {
        story:
          "A full-screen dialog that covers the entire viewport. Use for immersive workflows like multi-step wizards or detailed editing screens.",
      },
    },
  },
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger asChild>
        <LabelButton labelText="Full Screen Dialog" variantType="secondary" />
      </DialogTrigger>
      <DialogContent size="full">
        <DialogHeader>
          <DialogTitle>Roster Management</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <DialogDescription>
            Manage your full team roster, assign positions, and update player
            details.
          </DialogDescription>
          <div className="sui-mt-2 sui-flex sui-flex-col sui-gap-1">
            <div className="sui-flex sui-items-center sui-justify-between sui-rounded sui-bg-neutral-background-weak sui-p-2">
              <span>Sarah Johnson — Midfielder, #14</span>
              <LabelButton
                variantType="tertiary"
                labelText="Edit"
                size="compact"
              />
            </div>
            <div className="sui-flex sui-items-center sui-justify-between sui-rounded sui-bg-neutral-background-weak sui-p-2">
              <span>Marcus Chen — Goalkeeper, #1</span>
              <LabelButton
                variantType="tertiary"
                labelText="Edit"
                size="compact"
              />
            </div>
            <div className="sui-flex sui-items-center sui-justify-between sui-rounded sui-bg-neutral-background-weak sui-p-2">
              <span>Emily Rodriguez — Forward, #9</span>
              <LabelButton
                variantType="tertiary"
                labelText="Edit"
                size="compact"
              />
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <LabelButton variantType="secondary" labelText="Close" />
          </DialogClose>
          <LabelButton variantType="primary" labelText="Save Changes" />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

// ─── Composition Patterns ────────────────────────────────

export const WithoutFooter: Story = {
  name: "Without Footer",
  parameters: {
    docs: {
      description: {
        story:
          "A dialog without a footer. Useful for informational content that doesn't require user action beyond closing.",
      },
    },
  },
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger asChild>
        <LabelButton labelText="View Details" variantType="secondary" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Player Details</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <div className="sui-flex sui-flex-col sui-gap-1 sui-pb-2">
            <p>
              <strong>Name:</strong> Sarah Johnson
            </p>
            <p>
              <strong>Position:</strong> Midfielder
            </p>
            <p>
              <strong>Jersey:</strong> #14
            </p>
            <p>
              <strong>Joined:</strong> Sep 2024
            </p>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  ),
};

export const FormDialog: Story = {
  name: "With Form",
  parameters: {
    docs: {
      description: {
        story:
          "A dialog containing a form with multiple inputs and a select dropdown. Useful for collecting structured user information.",
      },
    },
  },
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger asChild>
        <LabelButton labelText="Register Player" />
      </DialogTrigger>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Player Registration</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <DialogDescription>
            Fill out the form below to register a new player for the season.
          </DialogDescription>
          <div className="sui-mt-2 sui-flex sui-flex-col sui-gap-2">
            <div className="sui-grid sui-grid-cols-2 sui-gap-2">
              <Input
                type="text"
                label="First Name"
                name="first_name"
                placeholder="e.g. Jordan"
              />
              <Input
                type="text"
                label="Last Name"
                name="last_name"
                placeholder="e.g. Rivera"
              />
            </div>
            <Input
              type="email"
              label="Email Address"
              name="email"
              placeholder="player@example.com"
            />
            <Input
              type="text"
              label="Jersey Number"
              name="jersey_number"
              placeholder="e.g. 22"
            />
            <Select
              label="Position"
              name="position"
              placeholder="Select a position"
              options={[
                { label: "Goalkeeper", value: "goalkeeper" },
                { label: "Defender", value: "defender" },
                { label: "Midfielder", value: "midfielder" },
                { label: "Forward", value: "forward" },
                { label: "Utility", value: "utility" },
              ]}
            />
            <Select
              label="Experience Level"
              name="experience"
              placeholder="Select experience"
              options={[
                { label: "Beginner (0-1 years)", value: "beginner" },
                { label: "Intermediate (2-4 years)", value: "intermediate" },
                { label: "Advanced (5+ years)", value: "advanced" },
                { label: "Elite / Competitive", value: "elite" },
              ]}
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <LabelButton variantType="secondary" labelText="Cancel" />
          </DialogClose>
          <LabelButton variantType="primary" labelText="Register" />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const WithoutCloseButton: Story = {
  name: "Without Close Button",
  parameters: {
    docs: {
      description: {
        story:
          "Set `showCloseIconButton={false}` on DialogContent to hide the X button. Useful when you want the user to explicitly choose an action.",
      },
    },
  },
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger asChild>
        <LabelButton labelText="Accept Terms" />
      </DialogTrigger>
      <DialogContent showCloseIconButton={false}>
        <DialogHeader>
          <DialogTitle>Terms of Service</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <DialogDescription>
            Please review and accept the updated terms of service to continue
            using TeamSnap.
          </DialogDescription>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <LabelButton variantType="secondary" labelText="Decline" />
          </DialogClose>
          <LabelButton variantType="primary" labelText="Accept" />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const NonScrollableContent: Story = {
  name: "Non-scrollable Content",
  parameters: {
    docs: {
      description: {
        story:
          "Set `scrollable={false}` on DialogContent when the dialog contains nested overlay UI (popovers, native selects, date pickers) that can get visually clipped by the overlay's own scroll container. The content remains centered via its fixed transform and does not scroll with the overlay.",
      },
    },
  },
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger asChild>
        <LabelButton labelText="Open non-scrollable Dialog" />
      </DialogTrigger>
      <DialogContent scrollable={false}>
        <DialogHeader>
          <DialogTitle>Edit Question</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <DialogDescription>
            This dialog uses <code>scrollable=&#123;false&#125;</code> so nested
            native controls render unclipped.
          </DialogDescription>
          <div className="sui-mt-2 sui-flex sui-flex-col sui-gap-2">
            <Input type="text" label="Question" name="question" />
            <label className="sui-flex sui-flex-col sui-gap-1 sui-text-label">
              Question type
              <select
                name="question_type"
                className="sui-rounded sui-border sui-border-neutral-border sui-p-1"
              >
                <option>Short answer</option>
                <option>Long answer</option>
                <option>Multiple choice</option>
                <option>Checkbox</option>
              </select>
            </label>
          </div>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <LabelButton variantType="secondary" labelText="Cancel" />
          </DialogClose>
          <LabelButton variantType="primary" labelText="Save" />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

