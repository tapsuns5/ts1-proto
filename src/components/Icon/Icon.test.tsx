import React from 'react';
import PropTypes from 'prop-types';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Icon, { getCodepoint } from './Icon';
import { IconProps } from './Icon.types';

describe('Icon', () => {
  let props: IconProps;
  it('should display the material design icon', () => {
    props = {
      name: 'account_circle',
    };
    render(<Icon {...props} />);
    const icon = screen.getByTestId('icon-component');
    expect(icon).toBeInTheDocument();
  });

  it('should display the custom icon', () => {
    props = {
      name: 'division',
    };
    render(<Icon {...props} />);
    const icon = screen.getByTestId('icon-component');
    expect(icon).toHaveClass(`Icon__icon-${props.name}`);
  });
  /**
   * WARNING: Changing options for or deleting existing props can be a breaking
   * change! Make breaking changes clear in commit notes and version numbers!
   */
  it('should allow all expected props', () => {
    // List all required props
    let propTest: IconProps = {
      name: 'account_circle', // I didn't list each one since there are so many options
    };
    // List all remaining options for required props and optional props
    propTest.size = 's';
    propTest.size = 'default';
    propTest.size = 'l';
    propTest.size = 'xl';
    propTest.filled = true;
    propTest.filled = false;
  });
});

describe('getCodepoint', () => {
  it('should return the correct codepoint', () => {
    expect(getCodepoint('account_circle')).toBe('');
    expect(getCodepoint('add')).toBe('');
    expect(getCodepoint('progress_activity')).toBe('');
  });
  it('should return the name if codepoint not defined', () => {
    expect(getCodepoint('typo_in_name')).toBe('typo_in_name');
  });
});
