import React from 'react';
import PropTypes from 'prop-types';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Avatar from './Avatar';
import { AvatarProps } from './Avatar.types';

describe('Avatar', () => {
  let props: AvatarProps;

  it('should display initials', () => {
    props = {
      type: 'initials',
      initials: 'JD',
    };
    const { getByTestId } = render(<Avatar {...props} />);
    const Avatar_component = getByTestId('avatar-component');
    expect(Avatar_component).toHaveTextContent('JD');
  });
  it('should display picture', () => {
    props = {
      type: 'picture',
      src: 'https://via.placeholder.com/150',
    };
    const { getByTestId } = render(<Avatar {...props} />);
    const Avatar_component = getByTestId('avatar-component');
    expect(Avatar_component).toHaveTextContent('');
    const imgElement = screen.getByRole('img');
    expect(imgElement).toHaveAttribute('src', 'https://via.placeholder.com/150');
  });
  it('should display placeholder', () => {
    props = {
      type: 'placeholder',
    };
    const { getByTestId } = render(<Avatar {...props} />);
    const Avatar_component = getByTestId('avatar-component');
    const placeholder = Avatar_component.querySelector('svg');
    expect(placeholder).toBeInTheDocument();
  });

  /**
   * WARNING: Changing options for or deleting existing props can be a breaking
   * change! Make breaking changes clear in commit notes and version numbers!
   */
  it('should allow all expected props', () => {
    // List all required props
    let propTest: AvatarProps = {
      type: 'picture',
    };
    // List all remaining options for required props and optional props
    propTest.type = 'initials';
    propTest.type = 'placeholder';
    propTest.size = 'default';
    propTest.size = 'small';
    propTest.size = 'large';
  });
});
