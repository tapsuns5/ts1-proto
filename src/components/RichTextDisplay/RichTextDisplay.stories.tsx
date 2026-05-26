import type { Meta, StoryObj } from "@storybook/react";
import { RichTextDisplay } from "./RichTextDisplay";

const meta = {
  component: RichTextDisplay,
  title: "Components/RichTextDisplay",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      subtitle:
        "Applies consistent typography styles to raw HTML from a CMS or WYSIWYG editor.",
    },
  },
} satisfies Meta<typeof RichTextDisplay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    html: `
      <p>This is a paragraph of rich text content that might come from a CMS or WYSIWYG editor like TinyMCE.</p>
      <p>Here is a second paragraph with a <a href="#">link</a> inside it.</p>
      <ul>
        <li>Unordered list item one</li>
        <li>Unordered list item two</li>
        <li>Unordered list item three
          <ol>
            <li>Nested ordered list item one</li>
            <li>Nested ordered list item two
              <ol>
                <li>Deeply nested ordered list item one</li>
                <li>Deeply nested ordered list item two</li>
              </ol>
            </li>
          </ol>
        </li>
      </ul>
      <ol>
        <li>Ordered list item one</li>
        <li>Ordered list item two</li>
        <li>Ordered list item three
          <ol>
            <li>Nested ordered list item one</li>
            <li>Nested ordered list item two</li>
          </ol>
        </li>
      </ol>
    `,
  },
};

export const WithCustomClassName: Story = {
  args: {
    className: "sui-p-4 sui-bg-neutral-background sui-rounded-lg",
    html: `
      <p>This example shows a custom <code>className</code> applied to the wrapper for additional spacing and background styling.</p>
      <p>Consumers can pass any Tailwind classes to customize the container.</p>
    `,
  },
};

export const WithSanitizationDisabled: Story = {
  name: "Sanitization Disabled",
  args: {
    sanitize: false,
    html: `
      <p>When you trust the HTML source (e.g. static content you control), you can set <code>sanitize={false}</code> to skip DOMPurify processing.</p>
    `,
  },
};

export const TeamAnnouncement: Story = {
  name: "Real-World: Team Announcement",
  args: {
    html: `
      <p>Hey team! A few updates for this week:</p>
      <ol>
        <li>Practice has been moved to <strong>Field B</strong> on Thursday due to maintenance on our usual field.</li>
        <li>Please RSVP for Saturday's game by Wednesday so we can plan the lineup. You can do that <a href="#">here</a>.</li>
        <li>Don't forget to bring your <em>white jerseys</em> — we're the away team this week.</li>
      </ol>
      <p>If you have any questions, reach out to me or Coach Martinez. See you on the field!</p>
    `,
  },
};
