import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

import Checkbox from './Checkbox';
import { CheckboxProps } from './Checkbox.types';

describe('Checkbox', () => {
  let props: CheckboxProps;

  it('should display label', () => {
    props = {
      label: 'Checkbox Label',
    };
    const { getByTestId } = render(<Checkbox {...props} />);
    const Checkbox_component = getByTestId('checkbox-component');
    expect(Checkbox_component).toHaveTextContent('Checkbox Label');
  });

  it('should display children in place of label', () => {
    props = {
      label: 'Checkbox Label',
      children: <div>custom label</div>,
    };
    const { getByTestId } = render(<Checkbox {...props} />);
    const Checkbox_component = getByTestId('checkbox-component');
    expect(Checkbox_component).not.toHaveTextContent('Checkbox Label');
    expect(Checkbox_component).toHaveTextContent('custom label');
  });

  /**
   * WARNING: Changing options for or deleting existing props can be a breaking
   * change! Make breaking changes clear in commit notes and version numbers!
   */
  it('should allow all expected props', () => {
    // List all required props
    let propTest: CheckboxProps = {
      children: '',
    };
    // List all remaining options for required props and optional props
    propTest.disabled = true;
    propTest.disabled = false;
    propTest.helpText = 'help text can be any string';
    propTest.label = 'label  text can be any string';
  });
});
