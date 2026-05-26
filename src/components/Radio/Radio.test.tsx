import React from 'react';
import PropTypes from 'prop-types';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

import Radio from './Radio';
import { RadioProps } from './Radio.types';

describe('Radio', () => {
  let props: RadioProps;

  it('should display label', () => {
    props = {
      label: 'Radio Label',
    };
    const { getByTestId } = render(<Radio {...props} />);
    const Radio_component = getByTestId('radio-component');
    expect(Radio_component).toHaveTextContent('Radio Label');
  });

  it('should display children in place of label', () => {
    props = {
      label: 'Radio Label',
      children: <div>custom label</div>,
    };
    const { getByTestId } = render(<Radio {...props} />);
    const Radio_component = getByTestId('radio-component');
    expect(Radio_component).not.toHaveTextContent('Radio Label');
    expect(Radio_component).toHaveTextContent('custom label');
  });

  /**
   * WARNING: Changing options for or deleting existing props can be a breaking
   * change! Make breaking changes clear in commit notes and version numbers!
   */
  it('should allow all expected props', () => {
    // List all required props
    let propTest: RadioProps = {
      children: '',
    };
    // List all remaining options for required props and optional props
    propTest.disabled = true;
    propTest.disabled = false;
    propTest.helpText = 'help text can be any string';
    propTest.label = 'label  text can be any string';
  });
});
