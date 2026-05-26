import React from 'react';
import PropTypes from 'prop-types';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import PhoneInput from './PhoneInput';
import { PhoneInputProps } from './PhoneInput.types';

describe('PhoneInput', () => {
  let props: PhoneInputProps;

  it('should display input text', () => {
    props = {
      name: 'phone',
      label: 'Phone Number',
    };
    const { getByTestId } = render(<PhoneInput {...props} />);
    const PhoneInput_component = getByTestId('phone-input-phone');
    fireEvent.change(PhoneInput_component, { target: { value: '+18005551234' } });
    expect(PhoneInput_component).toHaveDisplayValue('+1 800 555 1234');
  });

  it('deletes consecutive numbers in the middle of input', async () => {
    props = {
      name: 'phone',
      label: 'Phone Number',
    };
    const { getByTestId } = render(<PhoneInput {...props} />);
    const user = userEvent.setup();
    const PhoneInput_component = getByTestId('phone-input-phone');
    await user.type(PhoneInput_component, '+18005551234');
    await user.click(PhoneInput_component);
    await user.keyboard('{ArrowLeft}{ArrowLeft}');
    await user.keyboard('{Backspace}{Backspace}');
    expect(PhoneInput_component).toHaveDisplayValue('+1 800 555 34');
  });

  it('deletes all numbers by selecting all and pressing delete', async () => {
    props = {
      name: 'phone',
      label: 'Phone Number',
    };
    const { getByTestId } = render(<PhoneInput {...props} />);
    const user = userEvent.setup();
    const PhoneInput_component = getByTestId('phone-input-phone');
    await user.type(PhoneInput_component, '+18005551234');
    await user.keyboard('{Control>}a{/Control}');
    await user.keyboard('{Backspace}');

    expect(PhoneInput_component).toHaveDisplayValue('');
  });

  it('deletes all numbers using backspace', async () => {
    props = {
      name: 'phone',
      label: 'Phone Number',
    };
    const { getByTestId } = render(<PhoneInput {...props} />);
    const user = userEvent.setup();
    const PhoneInput_component = getByTestId('phone-input-phone');
    
    await user.type(PhoneInput_component, '+18005551234');
    await user.keyboard('{End}');
    await user.keyboard('{Backspace}'.repeat(12));
    expect(PhoneInput_component).toHaveDisplayValue('');
  });

  it('inserts numbers into the middle of an input', async () => {
    props = {
      name: 'phone',
      label: 'Phone Number',
    };
    const { getByTestId } = render(<PhoneInput {...props} />);
    const user = userEvent.setup();
    const PhoneInput_component = getByTestId('phone-input-phone');
    await user.type(PhoneInput_component, '+18005551234');
    await user.click(PhoneInput_component);
    await user.keyboard('{ArrowLeft}{ArrowLeft}');
    await user.keyboard('{Backspace}{Backspace}');
    await user.keyboard('99');

    expect(PhoneInput_component).toHaveDisplayValue('+1 800 555 9934');
  });
});
