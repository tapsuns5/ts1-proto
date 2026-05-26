import type React from 'react';
import classes from './SubInput.module.scss';
import type { SubInputProps } from './SubInput.types';
import { cn } from '../../utils';

/**
 * This component is meant to be used as part of a mulit-part composite input Ex BirthDate
  - Subset of Input component props
  - Renders a label and input field
  - uses Material style label which animates on focus
  */
const SubInput: React.FC<SubInputProps> = ({
  type,
  label,
  disabled,
  name,
  errorState,
  onChange,
  onBlur,
  value,
  inputProps,
  options,
  className = '',
  ...props
}) => {
  const mergedInputProps = {
    ...inputProps,
    value: onChange ? value : undefined,
    defaultValue: !onChange ? value : undefined,
    disabled,
    onChange,
    onBlur,
  };
  return (
    <div
      data-testid='sub-input-component'
      className={cn(
        classes.input__container,
        value ? classes['input__field--has-value'] : null,
        className
      )}
      {...props}
    >
      {type === 'text' && (
        <input
          className={cn(
            classes.input__field,
            errorState ? classes['input__field--error'] : null
          )}
          id={name}
          name={name}
          data-testid={`input-${name}`}
          type={type}
          {...(mergedInputProps as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      {type === 'select' && (
        <select
          className={cn(
            classes.input__field,
            classes['input__field--select'],
            errorState ? classes['input__field--error'] : null
          )}
          id={name}
          name={name}
          data-testid={`select-${name}`}
          {...(mergedInputProps as React.SelectHTMLAttributes<HTMLSelectElement>)}
        >
          <option value='' key='blank' disabled />
          {options?.map((option, i) => (
            <option value={option.value} key={`${i}-${option.value}`}>
              {option.label}
            </option>
          ))}
        </select>
      )}
      <fieldset className={classes.input__wrapper}>
        <label htmlFor={name} className={classes.input__label}>
          <span>{label}</span>
        </label>
        <legend className={classes.input__label}>
          <span>{label}</span>
        </legend>
      </fieldset>
    </div>
  );
};

export default SubInput;
