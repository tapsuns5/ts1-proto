import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ToggleButton } from './ToggleButton';

describe('ToggleButton', () => {
  it('renders with icon', () => {
    render(<ToggleButton icon="Flag" />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('renders in off state by default', () => {
    render(<ToggleButton icon="Flag" />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-pressed', 'false');
  });

  it('renders in on state when state prop is on', () => {
    render(<ToggleButton icon="Flag" state="on" />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });

  it('calls onStateChange when clicked from off to on', () => {
    const handleStateChange = jest.fn();
    render(<ToggleButton icon="Flag" onStateChange={handleStateChange} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(handleStateChange).toHaveBeenCalledWith('on');
  });

  it('calls onStateChange when clicked from on to off', () => {
    const handleStateChange = jest.fn();
    render(
      <ToggleButton icon="Flag" state="on" onStateChange={handleStateChange} />
    );
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(handleStateChange).toHaveBeenCalledWith('off');
  });

  it('calls onClick handler when provided', () => {
    const handleClick = jest.fn();
    render(<ToggleButton icon="Flag" onClick={handleClick} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not trigger callbacks when disabled', () => {
    const handleStateChange = jest.fn();
    const handleClick = jest.fn();
    render(
      <ToggleButton
        icon="Flag"
        disabled
        onStateChange={handleStateChange}
        onClick={handleClick}
      />
    );
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(handleStateChange).not.toHaveBeenCalled();
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies disabled attribute when disabled prop is true', () => {
    render(<ToggleButton icon="Flag" disabled />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('applies custom className', () => {
    render(<ToggleButton icon="Flag" className="custom-class" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('renders with admin sentiment by default', () => {
    render(<ToggleButton icon="Flag" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('sui-text-admin-action-text');
  });

  it('renders with consumer sentiment', () => {
    render(<ToggleButton icon="Flag" sentiment="consumer" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('sui-text-consumer-action-text');
  });

  it('renders with neutral sentiment', () => {
    render(<ToggleButton icon="Flag" sentiment="neutral" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('sui-text-neutral-text');
  });

  it('renders with inverse sentiment', () => {
    render(<ToggleButton icon="Flag" sentiment="inverse" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('sui-text-white');
  });

  it('renders with fixed size (32x32)', () => {
    render(<ToggleButton icon="Flag" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('sui-h-4');
    expect(button).toHaveClass('sui-w-4');
  });

  it('forwards ref to button element', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<ToggleButton icon="Flag" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('spreads additional props to button element', () => {
    render(<ToggleButton icon="Flag" data-testid="custom-toggle" />);
    const button = screen.getByTestId('custom-toggle');
    expect(button).toBeInTheDocument();
  });
});
