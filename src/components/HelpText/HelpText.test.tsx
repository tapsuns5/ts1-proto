import React from 'react';
import PropTypes from 'prop-types';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HelpText from './HelpText';
import { HelpTextProps } from './HelpText.types';

describe('HelpText', () => {
  let props: HelpTextProps;

  it('should display children', () => {
    props = {
      children: "naps siht ni deppart m'I !pleH",
    };
    const { getByTestId } = render(<HelpText {...props} />);
    const HelpText_component = getByTestId('help-text-component');
    expect(HelpText_component).toHaveTextContent("naps siht ni deppart m'I !pleH");
  });
});
