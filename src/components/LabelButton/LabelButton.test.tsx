import React from 'react';
import PropTypes from 'prop-types';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LabelButton from './LabelButton';
import { LabelButtonProps } from './LabelButton.types';

describe('LabelButton', () => {
  let props: LabelButtonProps;

  it('should display text', () => {
    props = {
      labelText: 'My Button',
    };
    const { getByTestId, getByText } = render(<LabelButton {...props} />);
    const LabelButton_component = getByTestId('label-button-component');
    expect(LabelButton_component).toHaveTextContent('My Button');
  });

  it('should apply consumer sentiment class', () => {
    props = {
      labelText: 'Consumer Button',
      sentiment: 'consumer',
    };
    const { getByTestId } = render(<LabelButton {...props} />);
    const LabelButton_component = getByTestId('label-button-component');
    expect(LabelButton_component).toHaveClass('sentiment-consumer');
  });

  /**
   * WARNING: Changing options for or deleting existing props can be a breaking
   * change! Make breaking changes clear in commit notes and version numbers!
   */
  it('should allow all expected props', () => {
    // List all required props
    let propTest: LabelButtonProps = {
      children: '',
    };
    // List all remaining options for required props and optional props
  });
});
