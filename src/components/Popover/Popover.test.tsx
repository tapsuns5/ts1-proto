import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  Popover,
  PopoverTrigger,
  PopoverClose,
  PopoverContent,
  PopoverProps,
} from './Popover';

describe('Popover', () => {
  window.ResizeObserver =
    window.ResizeObserver ||
    jest.fn().mockImplementation(() => ({
      disconnect: jest.fn(),
      observe: jest.fn(),
      unobserve: jest.fn(),
    }));

  let props: PopoverProps = {
    children: '',
    open: true,
    defaultOpen: true,
    onOpenChange: (open: boolean) => {},
    modal: true,
  };

  it('should render on trigger click', async () => {
    props = {
      ...props,
      children: 'Popover content',
    };
    const { getByTestId } = render(
      <Popover {...props}>
        <PopoverTrigger>
          <button data-testid='Popover-trigger'>Trigger</button>
        </PopoverTrigger>
        <PopoverContent>{props.children}</PopoverContent>
        <PopoverClose />
      </Popover>
    );
    const Popover_trigger = getByTestId('Popover-trigger');
    expect(Popover_trigger).toHaveTextContent('Trigger');
    await waitFor(() => {
      fireEvent.click(Popover_trigger);
    });

    const Popover_component = getByTestId('Popover-content');
    expect(Popover_component).toHaveTextContent('Popover content');
  });
});
