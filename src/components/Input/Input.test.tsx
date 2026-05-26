import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import Input from './Input';
import { InputProps } from './Input.types';
import { formatPhoneNumber } from './Input';
import { sanitizeDecimalInput } from '../../utils';

describe('Input', () => {
  let props: InputProps;

  it('should render component', async () => {
    props = {
      type: 'text',
      name: 'first_name',
      label: 'First Name',
    };
    const { getByTestId } = render(<Input {...props} />);
    const Input_component = getByTestId(`${props.name}-input`);
    expect(Input_component).not.toBeNull();
  });

  it('format phone number without country code', async () => {
    expect(formatPhoneNumber('1234567890')).toBe('123-456-7890');
  });

  it('format phone number with country code', async () => {
    expect(formatPhoneNumber('11234567890', true)).toBe('+1 (123) 456-7890');
  });

  it('should render left icon', async () => {
    props = {
      type: 'text',
      name: 'cities',
      label: 'Cities',
      leftIcon: 'search',
    };
    const { getByTestId } = render(<Input {...props} />);
    const Input_component = getByTestId(`${props.name}-input`);
    expect(getByTestId('input-left-icon')).not.toBeNull();
  });

  it('should not render left icon if leftIcon prop is not provided', async () => {
    props = {
      type: 'text',
      name: 'cities',
      label: 'Cities',
    };
    const { queryByTestId } = render(<Input {...props} />);
    expect(queryByTestId('input-left-icon')).toBeNull();
  });

  it('should render not render clear icon when there is no text', async () => {
    props = {
      type: 'text',
      name: 'cities',
      label: 'Cities',
      allowClear: true,
    };
    const { queryByTestId } = render(<Input {...props} />);
    expect(queryByTestId('input-clear-icon')).toBeNull();
  });

  it('should render clear icon when there is text', async () => {
    props = {
      type: 'text',
      name: 'cities',
      onChange: jest.fn(),
      label: 'Cities',
      allowClear: true,
      value: 'test',
    };
    const { getByTestId } = render(<Input {...props} />);
    expect(getByTestId('input-clear-icon')).not.toBeNull();
  });

  it('should clear text when clear icon is clicked', async () => {
    const onChange = jest.fn();
    props = {
      type: 'text',
      name: 'cities',
      onChange,
      label: 'Cities',
      allowClear: true,
      value: 'test',
    };
    const { getByTestId } = render(<Input {...props} />);
    const clearIcon = getByTestId('input-clear-icon');
    fireEvent.click(clearIcon);
    expect(onChange).toHaveBeenCalledWith({ target: { value: '' } });
  });

  it('should set step="any" on number input when allowDecimals is true', () => {
    const { getByTestId } = render(
      <Input type="number" name="decimal_test" label="Test" allowDecimals={true} />
    );
    const input = getByTestId('input-decimal_test');
    expect(input).toHaveAttribute('step', 'any');
  });

  it('should set precise step on number input when decimalLimit is provided', () => {
    const { getByTestId } = render(
      <Input type="number" name="decimal_limit_test" label="Test" allowDecimals={true} decimalLimit={2} />
    );
    const input = getByTestId('input-decimal_limit_test');
    expect(input).toHaveAttribute('step', '0.01');
  });

  it('sanitizeDecimalInput limits decimal places', () => {
    expect(sanitizeDecimalInput('12.345', 2)).toBe('12.34');
    expect(sanitizeDecimalInput('12.3', 2)).toBe('12.3');
    expect(sanitizeDecimalInput('12', 2)).toBe('12');
    expect(sanitizeDecimalInput('0.1234', 3)).toBe('0.123');
    expect(sanitizeDecimalInput('5.', 2)).toBe('5.');
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
