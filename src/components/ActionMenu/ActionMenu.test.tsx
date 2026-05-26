import '@testing-library/jest-dom';
import { fireEvent, render, screen, within } from '@testing-library/react';
import React from 'react';
import ActionMenu from './ActionMenu';
import { ActionMenuProps } from './ActionMenu.types';

describe('ActionMenu', () => {
  let props: ActionMenuProps;

  it('should display action buttons', () => {
    props = {
      isOpen: true,
      onClose: () => {},
      actions: [
        { label: 'New', icon: 'add', onClick: () => {} },
        { label: 'Edit', icon: 'edit', onClick: () => {} },
        { label: 'delete', icon: 'delete', onClick: () => {}, sentiment: 'negative' },
      ],
    };
    render(<ActionMenu {...props} />);
    const ActionMenu_component = screen.getByTestId('action-menu-component');
    expect(ActionMenu_component).toBeInTheDocument();
    const buttons = ActionMenu_component.querySelectorAll('button');
    expect(buttons.length).toBe(3);
  });

  it('should call action onClick functions', () => {
    const action1Onclick = jest.fn();
    const action2Onclick = jest.fn();
    props = {
      isOpen: true,
      onClose: jest.fn(),
      actions: [
        {
          label: 'Action 1',
          icon: 'add',
          onClick: action1Onclick,
        },
        {
          label: 'Action 2',
          icon: 'add',
          onClick: action2Onclick,
        },
      ],
    };
    render(<ActionMenu {...props} />);
    const ActionMenu_component = screen.getByTestId('action-menu-component');
    const buttons = within(ActionMenu_component).getAllByRole('button');
    expect(buttons.length).toBe(2);
    fireEvent.click(buttons[0]);
    expect(action1Onclick).toHaveBeenCalled();

    fireEvent.click(buttons[1]);
    expect(action2Onclick).toHaveBeenCalled();
  });

  it('should render the trigger', () => {
    props = {
      trigger: <button>Trigger</button>,
      actions: [{ label: 'New', icon: 'add', onClick: () => {} }],
    };
    render(<ActionMenu {...props} />);
    const trigger = screen.getByText('Trigger');
    expect(trigger).toBeInTheDocument();
    // It should not render the popover actions when the trigger is not clicked
    expect(screen.queryByTestId('action-menu-component')).toBeNull();
    expect(screen.queryByText('New')).toBeNull();
    fireEvent.click(trigger);
    expect(screen.getByTestId('action-menu-component')).toBeVisible();
    expect(screen.getByText('New')).toBeVisible();
  });

  it('should call the passed onClose function', () => {
    const onClose = jest.fn();
    const onClick = jest.fn();
    props = {
      isOpen: true,
      onClose,
      actions: [{ label: 'New', icon: 'add', onClick }],
    };
    render(<ActionMenu {...props} />);
    const ActionMenu_component = screen.getByTestId('action-menu-component');
    const buttons = ActionMenu_component.querySelectorAll('button');
    buttons[0] && fireEvent.click(buttons[0]);
    expect(onClose).toHaveBeenCalled();
  });

  /**
   * WARNING: Changing options for or deleting existing props can be a breaking
   * change! Make breaking changes clear in commit notes and version numbers!
   */
  it('should allow all expected props', () => {
    // List all required props
    let propTest: ActionMenuProps = {
      actions: [],
    };
    // List all remaining options for required props and optional props
    propTest.isOpen = true;
    propTest.isOpen = false;
  });

  it('should be open if isOpen is true', () => {
    props = {
      isOpen: true,
      onClose: () => {},
      actions: [{ label: 'New', icon: 'add', onClick: () => {} }],
    };
    render(<ActionMenu {...props} />);
    const ActionMenu_component = screen.getByTestId('action-menu-component');
    expect(ActionMenu_component).toBeVisible();
  });

  it('should be closed if isOpen is false', () => {
    props = {
      isOpen: false,
      onClose: () => {},
      actions: [{ label: 'New', icon: 'add', onClick: () => {} }],
    };
    render(<ActionMenu {...props} />);
    const ActionMenu_component = screen.queryByTestId('action-menu-component');
    expect(ActionMenu_component).toBeNull();
  });

  it('should close the menu after selecting an action', () => {
    props = {
      onClose: jest.fn(),
      trigger: <button>Trigger</button>,
      actions: [{ label: 'New', icon: 'add', onClick: () => {} }],
    };
    render(<ActionMenu {...props} />);
    fireEvent.click(screen.getByText('Trigger'));
    expect(screen.getByTestId('action-menu-component')).toBeVisible();
    fireEvent.click(screen.getByText('New'));
    expect(props.onClose).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId('action-menu-component')).toBeNull();
  });
});
