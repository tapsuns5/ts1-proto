import * as React from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '../../utils';
import Icon from '../Icon/Icon';
import { ToggleButtonProps } from './ToggleButton.types';

const toggleButtonVariants = cva(
  [
    'sui-inline-flex sui-items-center sui-justify-center',
    'sui-h-4 sui-w-4',
    'sui-rounded-full',
    'sui-border sui-border-transparent',
    'sui-transition-colors',
    'focus-visible:sui-outline-none focus-visible:sui-ring-2 focus-visible:sui-ring-offset-2',
  ],
  {
    variants: {
      sentiment: {
        admin: [
          'sui-text-admin-action-text',
          'hover:sui-bg-admin-action-background-weak-hover',
          'focus-visible:sui-ring-admin-action-border',
        ],
        consumer: [
          'sui-text-consumer-action-text',
          'hover:sui-bg-consumer-action-background-weak-hover',
          'focus-visible:sui-ring-consumer-action-border',
        ],
        neutral: [
          'sui-text-neutral-text',
          'hover:sui-bg-admin-action-background-weak-hover',
          'focus-visible:sui-ring-admin-action-border',
        ],
        inverse: [
          'sui-text-white',
          'hover:sui-bg-admin-action-background-weak-hover',
          'focus-visible:sui-ring-admin-action-border',
        ],
      },
      state: {
        off: '',
        on: '',
      },
      disabled: {
        true: [
          'sui-text-neutral-icon-disabled',
          'hover:sui-bg-transparent',
          'sui-cursor-not-allowed',
        ],
        false: 'sui-cursor-pointer',
      },
    },
    compoundVariants: [
      // On state backgrounds for each sentiment
      {
        sentiment: 'admin',
        state: 'on',
        disabled: false,
        className: 'sui-bg-admin-action-background-weak-pressed',
      },
      {
        sentiment: 'consumer',
        state: 'on',
        disabled: false,
        className: 'sui-bg-consumer-action-background-weak-pressed',
      },
      {
        sentiment: 'neutral',
        state: 'on',
        disabled: false,
        className: 'sui-bg-admin-action-background-weak-pressed',
      },
      {
        sentiment: 'inverse',
        state: 'on',
        disabled: false,
        className: 'sui-bg-admin-action-background-weak-pressed',
      },
    ],
    defaultVariants: {
      sentiment: 'admin',
      state: 'off',
      disabled: false,
    },
  }
);

const ToggleButton = React.forwardRef<
  HTMLButtonElement,
  ToggleButtonProps & VariantProps<typeof toggleButtonVariants>
>(
  (
    {
      icon,
      state = 'off',
      onStateChange,
      sentiment = 'admin',
      disabled = false,
      className,
      onClick,
      ...props
    },
    ref
  ) => {
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (onClick) {
        onClick(event);
      }
      if (onStateChange) {
        onStateChange(state === 'off' ? 'on' : 'off');
      }
    };

    return (
      <button
        ref={ref}
        type="button"
        role="button"
        aria-pressed={state === 'on'}
        disabled={disabled}
        className={cn(
          toggleButtonVariants({
            sentiment,
            state,
            disabled,
          }),
          className
        )}
        onClick={handleClick}
        {...props}
      >
        <Icon name={icon} size="s" filled={state === 'on'} />
      </button>
    );
  }
);

ToggleButton.displayName = 'ToggleButton';

export { ToggleButton };

// Remove this comment
