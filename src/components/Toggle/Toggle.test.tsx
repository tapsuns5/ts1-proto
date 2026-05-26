import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Toggle from './Toggle';
import { ToggleProps } from './Toggle.types';

describe('Toggle', () => {
  let props: ToggleProps;

  it('should default to on state', () => {
    props = {
      name: 'myToggle',
      on: true,
    };
    const { getByTestId } = render(<Toggle {...props} />);
    const Toggle_component = getByTestId('toggle-component');
    expect(Toggle_component).toHaveAttribute('checked');
  });

  /**
   * WARNING: Changing options for or deleting existing props can be a breaking
   * change! Make breaking changes clear in commit notes and version numbers!
   */
  it('should allow all expected props', () => {
    // List all required props
    let propTest: ToggleProps = {
      on: true,
      name: 'myToggle',
    };
  });
});
