import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CopiedTooltip } from './CopiedTooltip';
import type { CopiedTooltipProps } from './CopiedTooltip.types';

describe('CopiedTooltip', () => {
  let props: CopiedTooltipProps;

  beforeAll(() => {
    global.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
    });
  });

  beforeEach(() => {
    props = {
      textToCopy: 'https://figma.com',
    };
  });

  afterEach(() => {
    // Reset navigator clipboard mock
    (navigator.clipboard.writeText as jest.Mock).mockReset();
  });

  it('shows "Copied!" when clicked and hides after timeout', async () => {
    render(<CopiedTooltip {...props} />);

    await act(async () => {
      const button = screen.getByTestId('copied-tooltip-button');
      fireEvent.click(button);
    });

    expect(screen.getByText('Copied!')).toBeInTheDocument();

    await waitFor(
      () => {
        expect(screen.queryByText('Copied!')).toBeNull();
      },
      { timeout: 3000 }
    );
  });

  it('does not show tooltip or "Copied!" if disabled', () => {
    render(<CopiedTooltip {...props} disabled={true} />);
    const button = screen.getByTestId('copied-tooltip-button');
    expect(button).toBeDisabled();
    fireEvent.mouseOver(button);
    expect(screen.queryByText('Copy link')).not.toBeInTheDocument();
    fireEvent.click(button);
    expect(screen.queryByText('Copied!')).not.toBeInTheDocument();
  });

  it('uses custom copyLabel', () => {
    render(<CopiedTooltip {...props} copyLabel="Custom label" />);
    const button = screen.getByTestId('copied-tooltip-button');
    fireEvent.mouseOver(button);
    const content = screen.getAllByTestId('copied-tooltip-content')[0];
    expect(content).toBeInTheDocument();
    expect(content).toHaveTextContent('Custom label');
  });

  it('should render with custom icon button', async () => {
    const customLabel = 'hola';
    const onClick = jest.fn();
    render(
      <CopiedTooltip textToCopy="https://figma.com">
        <button data-testid="custom-icon-button" onClick={onClick}>
          {customLabel}
        </button>
      </CopiedTooltip>
    );
    const button = screen.getByTestId('custom-icon-button');
    await act(async () => {
      expect(button).toBeInTheDocument();
      fireEvent.click(button);
    });
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      'https://figma.com'
    );
    expect(screen.getByText('Copied!')).toBeInTheDocument();
    expect(onClick).toHaveBeenCalled();
  });

  it('does not show tooltip or "Copied!" when custom button is disabled', async () => {
    const customLabel = 'hola';
    render(
      <CopiedTooltip textToCopy="https://figma.com" disabled>
        <button disabled data-testid="custom-icon-button">
          {customLabel}
        </button>
      </CopiedTooltip>
    );
    const button = screen.getByTestId('custom-icon-button');
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
    fireEvent.mouseOver(button);
    expect(screen.queryByText('Copy link')).not.toBeInTheDocument();
    fireEvent.click(button);
    expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
    expect(screen.queryByText('Copied!')).not.toBeInTheDocument();
  });
});
