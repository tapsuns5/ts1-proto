import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Drawer from './Drawer';
import { DrawerProps } from './Drawer.types';

describe('Drawer', () => {
  let props: DrawerProps;

  it('should render component', async () => {
    props = {
      open: true,
      onCloseClick: () => {},
      title: 'My Drawer',
      testId: 'test-drawer',
    };
    const { getByTestId } = render(<Drawer {...props} />);
    const Select_component = getByTestId(props.testId);
    expect(Select_component).not.toBeNull();
  });
  it('should allow close from escape key', async () => {
    props = {
      open: true,
      onCloseClick: jest.fn(),
      allowEscapeKey: true,
      title: 'My Drawer',
      testId: 'test-drawer',
    };
    const { getByTestId } = render(<Drawer {...props} />);
    const Select_component = getByTestId(props.testId);
    expect(Select_component).not.toBeNull();
    await waitFor(() => {
      fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });
      expect(props.onCloseClick).toHaveBeenCalled();
    });
  });

  it('Header should render children', async () => {
    props = {
      open: true,
      onCloseClick: () => {},
      title: 'My Drawer',
      testId: 'test-drawer',
      children: <Drawer.Header>header</Drawer.Header>,
    };
    const { getByText } = render(<Drawer {...props} />);
    expect(getByText('header')).not.toBeNull();
  });

  it('Content should render children', async () => {
    props = {
      open: true,
      onCloseClick: () => {},
      title: 'My Drawer',
      testId: 'test-drawer',
      children: <Drawer.Content>content</Drawer.Content>,
    };
    const { getByText } = render(<Drawer {...props} />);
    expect(getByText('content')).not.toBeNull();
  });

  it('Footer should render children', async () => {
    props = {
      open: true,
      onCloseClick: () => {},
      title: 'My Drawer',
      testId: 'test-drawer',
      children: <Drawer.Footer>footer</Drawer.Footer>,
    };
    const { getByText } = render(<Drawer {...props} />);
    expect(getByText('footer')).not.toBeNull();
  });

  /**
   * WARNING: Changing options for or deleting existing props can be a breaking
   * change! Make breaking changes clear in commit notes and version numbers!
   */
  // it('should allow all expected props', () => {
  //   // List all required props
  //   let propTest: InputProps = {
  //     children: '',
  //   }
  //   // List all remaining options for required props and optional props
  //   propTest.type = 'info'
  //   propTest.type = 'success'
  //   propTest.type = 'warning'
  //   propTest.type = 'error'
  //   propTest.grayed = true
  //   propTest.grayed = false
  // })
});
