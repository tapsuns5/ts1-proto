import React from 'react';
import PropTypes from 'prop-types';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Birthdate from './Birthdate';
import type { BirthdateProps } from './Birthdate.types';

describe('Birthdate', () => {
  let props: BirthdateProps;

  it('should render and set date fields from value', () => {
    props = {
      name: 'test-bday',
      value: '1990-01-01',
      onChange: jest.fn(),
      size: 'small',
    };
    const { getByTestId, getByDisplayValue } = render(<Birthdate {...props} />);
    const Birthdate_component = getByTestId('birthdate-component');
    expect(Birthdate_component).toBeTruthy();

    const month = getByDisplayValue('January');
    expect(month).toBeTruthy();
    const day = getByDisplayValue('01');
    expect(day).toBeTruthy();
    const year = getByDisplayValue('1990');
    expect(year).toBeTruthy();
  });

  it('should use validation on blur', async () => {
    props = {
      name: 'test-bday',
      value: '',
      onChange: jest.fn(),
      size: 'small',
      validate: true,
    };
    const { getByTestId, findByText } = render(<Birthdate {...props} />);
    const Birthdate_component = getByTestId('birthdate-component');
    expect(Birthdate_component).toBeTruthy();

    fireEvent.change(getByTestId('select-birthdate_month'), { target: { value: '01' } });
    fireEvent.change(getByTestId('input-birthdate_day'), { target: { value: '01' } });
    fireEvent.change(getByTestId('input-birthdate_year'), { target: { value: '1990' } });
    expect(props.onChange).toHaveBeenCalledWith('1990-01-01');

    fireEvent.change(getByTestId('input-birthdate_day'), { target: { value: '33' } });
    fireEvent.focusOut(getByTestId('input-birthdate_day'));
    expect(props.onChange).toHaveBeenCalledWith('1990-01-33');
    expect(await findByText('Add a valid date')).toBeTruthy();
  });

  it('should successfully clear day value input', () => {
    props = {
      name: 'test-bday',
      value: '1990-01-01',
      onChange: jest.fn(),
      size: 'small',
    };
    const { getByTestId } = render(<Birthdate {...props} />);
    const Birthdate_component = getByTestId('birthdate-component');
    expect(Birthdate_component).toBeTruthy();

    const dayInput = getByTestId('input-birthdate_day');
    fireEvent.change(dayInput, { target: { value: '' } });
    expect(props.onChange).toHaveBeenCalledWith('1990-01-');
    expect(dayInput).toHaveTextContent('');
  });

  it('should clear date fields when clear button is clicked', () => {
    props = {
      name: 'test-bday',
      value: '1990-01-01',
      onChange: jest.fn(),
      size: 'small',
      showClearButton: true,
    };
    const { getByTestId } = render(<Birthdate {...props} />);
    const Birthdate_component = getByTestId('birthdate-component');
    expect(Birthdate_component).toBeTruthy();

    const clearButton = getByTestId('birthdate-clear-button');
    fireEvent.click(clearButton);

    expect(props.onChange).toHaveBeenCalledWith('');
    expect(screen.queryByDisplayValue('January')).toBeNull();
    expect(screen.queryByDisplayValue('01')).toBeNull();
    expect(screen.queryByDisplayValue('1990')).toBeNull();
  });

  /**
   * WARNING: Changing options for or deleting existing props can be a breaking
   * change! Make breaking changes clear in commit notes and version numbers!
   */
  // it('should allow all expected props', () => {
  //   // List all required props
  //   let propTest: BirthdateProps = {
  //     name: 'test',
  //   }
  //   // List all remaining options for required props and optional props

  // })
});
