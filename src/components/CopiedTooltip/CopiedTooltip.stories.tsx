import type { Meta, StoryObj } from '@storybook/react';
import LabelButton from '../LabelButton/LabelButton';
import { CopiedTooltip } from './CopiedTooltip';

// Metadata to configure how stories for this component are displayed
const meta = {
  component: CopiedTooltip,
  title: 'Components/CopiedTooltip',
  parameters: {
    // Center the component in the Canvas
    layout: 'centered',
    componentSubtitle: (
      <div>
        <p className="sui-mb-1">
          A tooltip component that has an animation for copying links.
        </p>
      </div>
    ),
  },
  // This component will have an automatically generated Autodocs entry
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    copyLabel: { control: 'text' },
    textToCopy: { control: 'text' },
  },
} satisfies Meta<typeof CopiedTooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

// The default story demonstrates a CopiedTooltip with default props.
export const Default: Story = {
  args: {
    copyLabel: 'Copy link',
    textToCopy: 'https://figma.com',
  },
  render: function Render(args) {
    return (
      <div className="sui-flex sui-h-[200px] sui-items-center sui-justify-center">
        <CopiedTooltip {...args} />
      </div>
    );
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    copyLabel: 'Copy link',
    textToCopy: 'https://figma.com',
  },
  render: function Render(args) {
    return (
      <div className="sui-flex sui-h-[200px] sui-items-center sui-justify-center">
        <CopiedTooltip {...args} />
      </div>
    );
  },
};

export const WithCustomIconButton: Story = {
  args: {
    copyLabel: 'Copy link',
    textToCopy: 'https://figma.com',
  },
  render: function Render(args) {
    return (
      <div className="sui-flex sui-h-[200px] sui-items-center sui-justify-center">
        <CopiedTooltip {...args}>
          <LabelButton
            labelText="HELLO THERE MY FRIEND"
            onClick={() => console.log('this button was clicked!')}
          />
        </CopiedTooltip>
      </div>
    );
  },
};
