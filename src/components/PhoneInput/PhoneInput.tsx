import React from "react";
import { cn } from "../../utils";
import classes from "../Input/Input.module.scss";
import InputWrapper from "../InputWrapper/InputWrapper";
import { calculateCursorPosition, formatPhoneNumber } from "./helpers";
import { PhoneInputProps } from "./PhoneInput.types";

/**
 * Specialized phone input component that formats phone numbers as they are typed.
  - imports the styles directly from Input.module.scss
  - uses libphonenumber-js to format phone numbers, a lighter version of google-libphonenumber
  */
const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(({
  label,
  placeholder,
  required,
  disabled,
  name,
  helpText,
  showHelpIcon = false,
  errors,
  errorState,
  onChange,
  onBlur,
  value,
  size = "default",
  inputProps,
  className = "",
  helpIconTooltipContent,
  tooltipProps,
  defaultCountryCode,
}, ref) => {
  const hasErrors = (errors && errors.length > 0) || errorState;
  const sizeClass = `input__field--${size}`;

  const inputRef = React.useRef<HTMLInputElement | null>(null);

  // Use a merged setter that supports both callback and object refs
  const setRefs = React.useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
      }
    },
    [ref],
  );

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { selectionStart, value } = e.target;
    
    // Update the value
    e.target.value = formatPhoneNumber(value, defaultCountryCode);
    
    // Restore cursor position after formatting
    setTimeout(() => {
      if (inputRef.current && selectionStart !== null) {
        const newPosition = calculateCursorPosition(value, e.target.value, selectionStart);
        inputRef.current.setSelectionRange(newPosition, newPosition);
      }
    }, 0);

    onChange && onChange(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && inputRef.current) {
      const { selectionStart, selectionEnd, value } = inputRef.current;
      
      // Early exit: if user has selected text, let the default behavior handle it
      if (selectionStart !== selectionEnd) {
        return;
      }
      
      if (selectionStart !== null && selectionStart > 0) {
        const charAtCursor = value[selectionStart - 1];
        
        // If we're about to delete a formatting character, skip over it to delete the digit instead
        if (charAtCursor === ')' || charAtCursor === '-' || charAtCursor === ' ') {
          e.preventDefault();
          
          // Find the previous digit and delete it
          let newValue = value;
          let newCursorPos = selectionStart;
          
          for (let i = selectionStart - 1; i >= 0; i--) {
            if (/\d/.test(newValue[i])) {
              newValue = newValue.slice(0, i) + newValue.slice(i + 1);
              newCursorPos = i;
              break;
            }
          }
          
          // Format the new value and update
          const formattedValue = formatPhoneNumber(newValue, defaultCountryCode);
          inputRef.current.value = formattedValue;
          
          const finalCursorPos = calculateCursorPosition(newValue, formattedValue, newCursorPos);
          inputRef.current.setSelectionRange(finalCursorPos, finalCursorPos);
          
          // Trigger onChange if provided
          if (onChange) {
            const changeEvent = {
              target: inputRef.current,
              currentTarget: inputRef.current,
            } as React.ChangeEvent<HTMLInputElement>;
            onChange(changeEvent);
          }
        }
      }
    }
  };

  return (
    <>
      <InputWrapper
        label={label}
        required={required}
        name={name}
        helpText={helpText}
        showHelpIcon={showHelpIcon}
        errors={errors}
        className={className}
        helpIconTooltipContent={helpIconTooltipContent}
        tooltipProps={tooltipProps}
      >
        <input
          className={cn(classes["input__field"], classes[sizeClass], {
            [classes["input__field--error"]]: hasErrors,
          })}
          id={name}
          name={name}
          data-testid={`phone-input-${name}`}
          type="tel"
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          onChange={handleOnChange}
          ref={setRefs}
          onKeyDown={handleKeyDown}
          onBlur={onBlur}
          {...(inputProps as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      </InputWrapper>
    </>
  );
});

export default PhoneInput;
