import React from 'react';
import PropTypes from 'prop-types';
import { render, screen } from '@testing-library/react';
import IconButton from './IconButton';
import { IconButtonProps } from './IconButton.types';

describe('IconButton', () => {
  let props: IconButtonProps;

  /**
   * WARNING: Changing options for or deleting existing props can be a breaking
   * change! Make breaking changes clear in commit notes and version numbers!
   */
  it('should allow all expected props', () => {
    // List all required props
    let propTest: IconButtonProps = {
      icon: 'shopping_cart',
    };
  });
});
