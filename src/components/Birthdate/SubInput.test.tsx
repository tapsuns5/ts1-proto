import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import SubInput from './SubInput';
import type { SubInputProps } from './SubInput.types';

describe('SubInput', () => {
  let props: SubInputProps;

  it('should render', () => {
    props = {
      name: 'sub-input',
      type: 'text',
    };
    const { getByTestId } = render(<SubInput {...props} />);
    const SubInput_component = getByTestId('sub-input-component');
    expect(SubInput_component).toBeInTheDocument();
  });
  it('should render with label', () => {
    props = {
      name: 'sub-input',
      type: 'text',
      label: 'Sub Input',
    };
    const { getAllByLabelText } = render(<SubInput {...props} />);
    const label = getAllByLabelText('Sub Input');
    expect(label.length).toEqual(1);
  });
  it('should render with value', () => {
    props = {
      name: 'sub-input',
      type: 'text',
      value: 'Sub Input Value',
    };
    const { getByDisplayValue } = render(<SubInput {...props} />);
    const input = getByDisplayValue('Sub Input Value');
    expect(input).toBeInTheDocument();
  });
  it('should render with error state', () => {
    props = {
      name: 'sub-input',
      type: 'text',
      errorState: true,
    };
    const { getByTestId } = render(<SubInput {...props} />);
    const SubInput_component = getByTestId('sub-input-component');
    const input = SubInput_component.querySelector('input');
    expect(input).toHaveClass('input__field--error');
  });
});
