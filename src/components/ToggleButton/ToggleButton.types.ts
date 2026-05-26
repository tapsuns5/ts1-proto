export interface ToggleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Icon name to display */
  icon: string;

  /** State of the toggle button - 'off' (default) or 'on' (filled icon) */
  state?: 'off' | 'on';

  /** Callback when state changes */
  onStateChange?: (state: 'off' | 'on') => void;

  /** Visual sentiment/theme of the button */
  sentiment?: 'admin' | 'consumer' | 'neutral' | 'inverse';

  /** Additional CSS classes */
  className?: string;
}
