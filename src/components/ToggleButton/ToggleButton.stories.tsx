import type { Meta, StoryObj } from '@storybook/react';
import { ToggleButton } from './ToggleButton';
import React from 'react';
import { ICON_NAMES } from '../Icon/Icon.types';

const meta = {
  title: 'Components/ToggleButton',
  component: ToggleButton,
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: 'select',
      options: ICON_NAMES,
      description: 'Icon to display',
      table: {
        type: { summary: 'string' },
      },
    },
    sentiment: {
      control: 'select',
      options: ['admin', 'consumer', 'neutral', 'inverse'],
      description: 'Visual sentiment/theme of the button',
      table: {
        type: { summary: "'admin' | 'consumer' | 'neutral' | 'inverse'" },
      },
    },
    state: {
      control: 'radio',
      options: ['off', 'on'],
      description: 'State of the toggle button - off (default) or on (filled icon)',
      table: {
        type: { summary: "'off' | 'on'" },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
      table: {
        type: { summary: 'boolean' },
      },
    },
  },
  args: {
    icon: 'Flag',
    state: 'off',
    sentiment: 'admin',
    disabled: false,
  },
  render: (args) => {
    const [state, setState] = React.useState<'off' | 'on'>(args.state || 'off');

    // Sync with external state changes from controls
    React.useEffect(() => {
      setState(args.state || 'off');
    }, [args.state]);

    return (
      <ToggleButton
        {...args}
        state={state}
        onStateChange={setState}
      />
    );
  },
} satisfies Meta<typeof ToggleButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: 'Flag',
    state: 'off',
    sentiment: 'admin',
  },
};

export const On: Story = {
  args: {
    icon: 'Flag',
    state: 'on',
    sentiment: 'admin',
  },
};

export const Disabled: Story = {
  args: {
    icon: 'Flag',
    disabled: true,
    sentiment: 'admin',
  },
};

export const DisabledOn: Story = {
  args: {
    icon: 'Flag',
    state: 'on',
    disabled: true,
    sentiment: 'admin',
  },
};

export const ConsumerSentiment: Story = {
  args: {
    icon: 'Flag',
    state: 'off',
    sentiment: 'consumer',
  },
};

export const ConsumerOn: Story = {
  args: {
    icon: 'Flag',
    state: 'on',
    sentiment: 'consumer',
  },
};

export const NeutralSentiment: Story = {
  args: {
    icon: 'Flag',
    state: 'off',
    sentiment: 'neutral',
  },
};

export const InverseSentiment: Story = {
  args: {
    icon: 'Flag',
    state: 'off',
    sentiment: 'inverse',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

export const Interactive: Story = {
  render: () => {
    const [state, setState] = React.useState<'off' | 'on'>('off');
    return (
      <div className="sui-flex sui-flex-col sui-gap-4">
        <ToggleButton icon="Flag" state={state} onStateChange={setState} />
        <p className="sui-text-label">
          Current state: <strong>{state}</strong>
        </p>
      </div>
    );
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="sui-flex sui-flex-col sui-gap-4">
      <div className="sui-flex sui-gap-2 sui-items-center">
        <span className="sui-text-label sui-w-24">Admin:</span>
        <ToggleButton icon="Flag" sentiment="admin" state="off" />
        <ToggleButton icon="Flag" sentiment="admin" state="on" />
        <ToggleButton icon="Flag" sentiment="admin" disabled />
      </div>
      <div className="sui-flex sui-gap-2 sui-items-center">
        <span className="sui-text-label sui-w-24">Consumer:</span>
        <ToggleButton icon="Flag" sentiment="consumer" state="off" />
        <ToggleButton icon="Flag" sentiment="consumer" state="on" />
        <ToggleButton icon="Flag" sentiment="consumer" disabled />
      </div>
      <div className="sui-flex sui-gap-2 sui-items-center">
        <span className="sui-text-label sui-w-24">Neutral:</span>
        <ToggleButton icon="Flag" sentiment="neutral" state="off" />
        <ToggleButton icon="Flag" sentiment="neutral" state="on" />
        <ToggleButton icon="Flag" sentiment="neutral" disabled />
      </div>
      <div className="sui-flex sui-gap-2 sui-items-center sui-bg-neutral-background-strong sui-p-4 sui-rounded">
        <span className="sui-text-label sui-w-24 sui-text-white">
          Inverse:
        </span>
        <ToggleButton icon="Flag" sentiment="inverse" state="off" />
        <ToggleButton icon="Flag" sentiment="inverse" state="on" />
        <ToggleButton icon="Flag" sentiment="inverse" disabled />
      </div>
    </div>
  ),
};
