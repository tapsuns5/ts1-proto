import React from 'react';
import type { BirthdateProps } from './Birthdate.types';
import InputWrapper from '../InputWrapper/InputWrapper';
import SubInput from './SubInput';
import { isValidDate } from './validation';
import { cn } from '../../utils';
import IconButton from '../IconButton/IconButton';

const months = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

/**
 * An opinionated input component for birthdate fields.
  - The 3 input fields actually update a hidden input field with the full date.
    - adding `inputProps` will pass props to the hidden input field
    - pass in value and onChange to set/get the full date
    - pass in `validate` to validate the date, or use `errors` prop to pass in errors for external validation
  */
const Birthdate: React.FC<BirthdateProps> = ({
  name,
  value,
  onChange,
  size,
  className = '',
  label = 'Date of birth',
  required,
  validate,
  inputProps = {},
  errors: passedErrors = [],
  showClearButton = false,
  ...props
}) => {
  const [dateValue, setDateValue] = React.useState('');
  const [monthValue, setMonthValue] = React.useState('');
  const [dayValue, setDayValue] = React.useState('');
  const [yearValue, setYearValue] = React.useState('');
  const [invalid, setInvalid] = React.useState<boolean>(false);

  React.useEffect(() => {
    // only update dateValue if all three values are set
    if (
      yearValue &&
      monthValue &&
      dayValue &&
      yearValue.length === 4 &&
      monthValue.length === 2 &&
      dayValue.length === 2
    ) {
      const dateString = `${yearValue}-${monthValue}-${dayValue}`;
      setDateValue(dateString);
      onChange?.(dateString);
    }
  }, [yearValue, monthValue, dayValue, onChange]);

  React.useEffect(() => {
    if (value) {
      const [year, month, day] = value.split('-');
      setYearValue(year);
      setMonthValue(month);
      setDayValue(day);
    } else {
      setYearValue('');
      setMonthValue('');
      setDayValue('');
      setDateValue('');
    }
  }, [value]);

  React.useEffect(() => {
    if (!validate) return;
    if (!dateValue) return;
    if (!isValidDate(dateValue)) {
      setInvalid(true);
    } else {
      setInvalid(false);
    }
  }, [dateValue, validate]);

  const errors = invalid ? ['Add a valid date', ...passedErrors] : passedErrors;

  const inputGroupProps = {
    errorState: errors?.length > 0,
    size,
  };

  return (
    <div
      data-testid='birthdate-component'
      className={cn('sui-inline', className)}
      {...props}
    >
      <InputWrapper label={label} name={name} errors={errors} required={required}>
        <input type='hidden' name={name} value={dateValue} {...inputProps} />
        <div className="sui-flex sui-gap-1 sui-items-end">
          <SubInput
            type='select'
            name='birthdate_month'
            className='sui-w-1/2 sui-flex-grow'
            {...inputGroupProps}
            options={months}
            label='Month'
            value={monthValue}
            onChange={(e) => {
              setInvalid(false);
              setMonthValue(e.target.value);
            }}
          />
          <SubInput
            type='text'
            name='birthdate_day'
            className='sui-w-1/5 sui-flex-grow'
            {...inputGroupProps}
            label='Day'
            value={dayValue}
            onChange={(e) => {
              setInvalid(false);
              const sanitizedDay = e.target.value?.replace(/\D/g, '');
              setDayValue(sanitizedDay);
              onChange?.(`${yearValue}-${monthValue}-${sanitizedDay}`);
            }}
            onBlur={(e) => {
              if (e.target.value.length === 1) {
                setDayValue(`0${e.target.value}`);
              }
            }}
            inputProps={{
              inputMode: 'numeric',
              maxLength: 2,
            }}
          />
          <SubInput
            type='text'
            name='birthdate_year'
            className='sui-w-1/3 sui-flex-grow'
            {...inputGroupProps}
            label='Year'
            value={yearValue}
            onChange={(e) => {
              setInvalid(false);
              const sanitizedYear = e.target.value?.replace(/\D/g, '');
              setYearValue(sanitizedYear);
              onChange?.(`${sanitizedYear}-${monthValue}-${dayValue}`);
            }}
            onBlur={(e) => {
              value = e.target.value;
              if (!value) return;
              const year = Number.parseInt(e.target.value);
              if (value.length === 2) {
                // best guess for 2-digit year
                setYearValue(year > 23 ? `19${year}` : `20${year}`);
              }
              if (value.length === 1 || value.length === 3) {
                setYearValue(''); // blank out year if odd number of digits
              }
            }}
            inputProps={{
              inputMode: 'numeric',
              maxLength: 4,
            }}
          />
          {showClearButton && (
            <IconButton
              icon='close'
              variant='neutral'
              className='sui-mb-1'
              data-testid='birthdate-clear-button'
              onClick={() => {
                setYearValue('');
                setMonthValue('');
                setDayValue('');
                setDateValue('');
                onChange && onChange('');
              }}
              size="compact"
            />
          )}
        </div>
      </InputWrapper>
    </div>
  );
};

export default Birthdate;