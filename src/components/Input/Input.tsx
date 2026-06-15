import React, { TextareaHTMLAttributes } from "react";
import {
  cn,
  isFirefox,
  isSafari,
  localStringToNumber,
  sanitizeDecimalInput,
} from "../../utils";
import Icon from "../Icon/Icon";
import IconButton from "../IconButton/IconButton";
import InputWrapper from "../InputWrapper/InputWrapper";
import classes from "./Input.module.scss";
import { InputProps } from "./Input.types";

/**
 * Secondary description on Storybook Docs. I can have multiple lines and
   bullets!
  - The primary component has:
    - CSS modules
    - Tailwind styles
    - CSS variables
  - To make sure all different CSS channels are working

  TO-DO: Add forwardRef just in case parent wants to pass ref to input
  TO-DO: Split types depending on input type
  */

const Input = React.forwardRef<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  InputProps
>(
  (
    {
      type,
      label,
      placeholder,
      required,
      disabled,
      name,
      helpText,
      showHelpIcon = false,
      errors,
      leftIcon,
      allowClear,
      errorState,
      onChange,
      onBlur,
      value,
      rows = 8,
      size = "default",
      inputProps,
      currency,
      maxChars,
      options,
      className = "",
      allowDecimals = true,
      decimalLimit,
      helpIconTooltipContent,
      tooltipProps,
      allowCountryCode,
    },
    ref,
  ) => {
    const { className: inputClassName, ...restInputProps } = inputProps ?? {};
    const [showPassword, setShowPassword] = React.useState(false);
    const hasErrors = (errors && errors.length > 0) || errorState;
    const sizeClass = `input__field--${size}`;
    const showClear = allowClear && value && ["text", "email"].includes(type);
    // Bypasses React's value setter to preserve trailing zeros on type="number" inputs
    const getNativeInputValueSetter = () =>
      typeof HTMLInputElement !== "undefined"
        ? Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")
            ?.set
        : undefined;
    // Treats decimalLimit={0} the same as allowDecimals={false}
    const effectiveAllowDecimals = allowDecimals && decimalLimit !== 0;
    // Derives the HTML step attribute from decimalLimit (e.g. decimalLimit=2 → "0.01")
    const decimalStep =
      effectiveAllowDecimals && decimalLimit !== undefined && decimalLimit > 0
        ? `0.${"0".repeat(decimalLimit - 1)}1`
        : effectiveAllowDecimals
          ? "any"
          : undefined;

    const inputRef = React.useRef<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >(null);

    // NOTE: Momentary setRefs till we start separating the inputs in their own files
    const setRefs = (
      el: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null,
    ) => {
      // Assign to inputRef
            inputRef.current = el;
      // Assign to the forwarded ref (which can be a function or object)
      if (typeof ref === "function") {
        ref(el);
      } else if (ref) {
        (ref as React.MutableRefObject<typeof el>).current = el;
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
          <>
            {["text", "email", "number"].includes(type) && (
              <div className={classes["input__field--text__container"]}>
                {leftIcon && (
                  <Icon
                    className={classes["input__field--text-icon"]}
                    name={leftIcon}
                    size="s"
                    data-testid={"input-left-icon"}
                  />
                )}
                <input
                  className={cn(
                    classes["input__field"],
                    classes[sizeClass],
                    leftIcon && classes["input__field--text"],
                    showClear && classes["input__field--text-clear"],
                    hasErrors && classes["input__field--error"],
                    inputClassName,
                  )}
                  id={name}
                  name={name}
                  data-testid={`input-${name}`}
                  type={type}
                  placeholder={placeholder}
                  value={value}
                  disabled={disabled}
                  {...(type === "number" &&
                    decimalStep && { step: decimalStep })}
                  onChange={(e) => {
                    if (
                      type === "number" &&
                      maxChars &&
                      e.target.value.length > maxChars
                    ) {
                      e.target.value = e.target.value.slice(0, maxChars);
                    }
                    onChange?.(e);
                  }}
                  onBlur={onBlur}
                  ref={ref as React.RefObject<HTMLInputElement>}
                  {...(type === "number" &&
                    !effectiveAllowDecimals && {
                      onInput: (e: React.FormEvent<HTMLInputElement>) => {
                        const target = e.target as HTMLInputElement;
                        if (target.value === "" || isNaN(Number(target.value)))
                          return;
                        target.value = Math.floor(
                          Number(target.value),
                        ).toString();
                      },
                    })}
                  {...(type === "number" &&
                    effectiveAllowDecimals &&
                    decimalLimit !== undefined && {
                      onInput: (e: React.FormEvent<HTMLInputElement>) => {
                        const target = e.target as HTMLInputElement;
                        const sanitized = sanitizeDecimalInput(
                          target.value,
                          decimalLimit,
                        );
                        if (sanitized !== target.value) {
                          getNativeInputValueSetter()?.call(target, sanitized);
                        }
                      },
                    })}
                  maxLength={maxChars}
                  {...(restInputProps as React.InputHTMLAttributes<HTMLInputElement>)}
                />
                {showClear && (
                  <Icon
                    name="close"
                    size="s"
                    data-testid={"input-clear-icon"}
                    className={classes["input__field--text-clear-icon"]}
                    onClick={() => {
                      onChange &&
                        onChange({
                          target: { value: "" },
                        } as React.ChangeEvent<HTMLInputElement>);
                    }}
                  />
                )}
                {maxChars && (
                  <span className={`${classes["input__charcount"]}`}>
                    {(value ?? "").length}/{maxChars}
                  </span>
                )}
              </div>
            )}
            {type === "password" && (
              <div
                className={` ${classes["input__field--password__container"]} `}
              >
                <input
                  className={cn(
                    classes["input__field"],
                    classes[sizeClass],
                    hasErrors && classes["input__field--error"],
                    inputClassName,
                  )}
                  id={name}
                  name={name}
                  data-testid={`input-${name}`}
                  type={showPassword ? "text" : "password"}
                  placeholder={placeholder}
                  value={value}
                  disabled={disabled}
                  onChange={onChange}
                  onBlur={onBlur}
                  aria-label={
                    showPassword
                      ? "password field with visible text"
                      : "password field with masked text"
                  }
                  ref={ref as React.RefObject<HTMLInputElement>}
                  {...(restInputProps as React.InputHTMLAttributes<HTMLInputElement>)}
                />
                <div
                  className={classes["input__field--password__icon-wrapper"]}
                >
                  <IconButton
                    icon={showPassword ? "visibility" : "visibility_off"}
                    variant="neutral"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    aria-pressed={showPassword}
                    size="compact"
                  />
                </div>
              </div>
            )}
            {type === "phone" && (
              <input
                className={cn(
                  classes["input__field"],
                  classes[sizeClass],
                  hasErrors && classes["input__field--error"],
                  inputClassName,
                )}
                id={name}
                name={name}
                data-testid={`phone-${name}`}
                type="tel"
                placeholder={placeholder}
                value={value}
                disabled={disabled}
                onChange={(e) => {
                  e.target.value = formatPhoneNumber(
                    e.target.value,
                    allowCountryCode,
                  );
                  onChange && onChange(e);
                }}
                onBlur={onBlur}
                ref={ref as React.RefObject<HTMLInputElement>}
                {...(restInputProps as React.InputHTMLAttributes<HTMLInputElement>)}
              />
            )}
            {(type === "date" || type === "datetime") && (
              <div className={` ${classes["input__field--date__container"]} `}>
                <input
                  // ref={ref as React.RefObject<HTMLInputElement>}
                  ref={setRefs}
                  className={cn(
                    classes["input__field"],
                    classes["input__field--date"],
                    classes[sizeClass],
                    hasErrors && classes["input__field--error"],
                    isFirefox() && type === "datetime" && classes["input__field--datetime-firefox"],
                    inputClassName,
                  )}
                  id={name}
                  name={name}
                  data-testid={`date-${name}`}
                  type={`${type}${type === "datetime" ? "-local" : ""}`}
                  placeholder="mm/dd/yyyy"
                  value={value}
                  disabled={disabled}
                  onChange={onChange}
                  onBlur={onBlur}
                  {...(restInputProps as React.InputHTMLAttributes<HTMLInputElement>)}
                />
                {!isSafari() && !(isFirefox() && type === "datetime") && (
                  <div className={classes["input__field--date__icon-wrapper"]}>
                    <IconButton
                      className={cn(
                        size === "small" ? "sui-h-3 sui-w-3" : "",
                        "active:sui-scale-100",
                      )}
                      icon="calendar_month"
                      onClick={() => {
                        if (
                          inputRef.current &&
                          "showPicker" in inputRef.current
                        ) {
                          (inputRef.current as HTMLInputElement).showPicker();
                        }
                      }}
                      disabled={disabled}
                      size="compact"
                    />
                  </div>
                )}
              </div>
            )}
            {type === "financial" && (
              <div
                className={` ${classes["input__field--financial__container"]} ${currency ? classes["input__field--financial__container--has-curency"] : ""} `}
              >
                <Icon
                  className={classes["input__field--financial-icon"]}
                  name="attach_money"
                  size="s"
                />
                <input
                  ref={ref as React.RefObject<HTMLInputElement>}
                  className={cn(
                    classes["input__field"],
                    classes["input__field--financial"],
                    classes[sizeClass],
                    hasErrors && classes["input__field--error"],
                    inputClassName,
                  )}
                  id={name}
                  name={name}
                  data-testid={`financial-${name}`}
                  type="text"
                  inputMode="decimal"
                  placeholder={placeholder}
                  value={value}
                  disabled={disabled}
                  onChange={(e) => {
                    e.target.value = filterFinancialInput(
                      e.target.value,
                      effectiveAllowDecimals,
                      decimalLimit,
                    );
                    onChange?.(e);
                  }}
                  onBlur={(e) => {
                    const rawValue = e.target.value;
                    const options = {
                      currency: currency || "USD",
                      style: "decimal",
                      currencyDisplay: "symbol",
                      useGrouping: false,
                      ...(effectiveAllowDecimals && {
                        minimumFractionDigits: decimalLimit ?? 2,
                        maximumFractionDigits: decimalLimit ?? 2,
                      }),
                    };
                    const formattedValue =
                      rawValue || rawValue === "0"
                        ? localStringToNumber(rawValue).toLocaleString(
                            undefined,
                            options,
                          )
                        : "";
                    e.target.value = formattedValue;
                    onChange?.(e);
                    onBlur?.(e);
                  }}
                  {...(restInputProps as React.InputHTMLAttributes<HTMLInputElement>)}
                />

                {currency && (
                  <span className={classes["input__field--financial-currency"]}>
                    {currency}
                  </span>
                )}
              </div>
            )}
            {type === "textarea" && (
              <div className={classes["input__field--textarea__container"]}>
                <textarea
                  className={cn(
                    classes["input__field"],
                    classes["input__field--textarea"],
                    classes[sizeClass],
                    hasErrors && classes["input__field--error"],
                    inputClassName,
                  )}
                  id={name}
                  name={name}
                  data-testid={`textarea-${name}`}
                  value={value}
                  placeholder={placeholder}
                  disabled={disabled}
                  onChange={(e) => {
                    onChange && onChange(e);
                  }}
                  onBlur={onBlur}
                  rows={rows}
                  maxLength={maxChars}
                  ref={ref as React.RefObject<HTMLTextAreaElement>}
                  {...(restInputProps as TextareaHTMLAttributes<HTMLTextAreaElement>)}
                ></textarea>
                {maxChars && (
                  <span className={`${classes["input__charcount"]}`}>
                    {(value ?? "").length}/{maxChars}
                  </span>
                )}
              </div>
            )}
            {type === "select" && (
              <div className={classes["input__field--select__container"]}>
                <select
                  className={cn(
                    classes["input__field"],
                    classes["input__field--select"],
                    classes[sizeClass],
                    hasErrors && classes["input__field--error"],
                    inputClassName,
                  )}
                  id={name}
                  name={name}
                  data-testid={`select-${name}`}
                  value={value}
                  disabled={disabled}
                  onChange={(e) => {
                    onChange && onChange(e);
                  }}
                  onBlur={onBlur}
                  ref={ref as React.RefObject<HTMLSelectElement>}
                  {...(restInputProps as React.SelectHTMLAttributes<HTMLSelectElement>)}
                >
                  {placeholder && (
                    <option value="" disabled>
                      {placeholder}
                    </option>
                  )}
                  {options?.map((option: any, i: number) => (
                    <option value={option.value} key={`${i}-${option.value}`}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </>
        </InputWrapper>
      </>
    );
  },
);

export default Input;

function filterFinancialInput(
  value: string,
  allowDecimals: boolean,
  decimalLimit?: number,
): string {
  let filtered = value.replace(/[^\d.\-]/g, "");
  const dotIdx = filtered.indexOf(".");
  if (dotIdx !== -1) {
    filtered =
      filtered.slice(0, dotIdx + 1) +
      filtered.slice(dotIdx + 1).replace(/\./g, "");
  }
  if (!allowDecimals) {
    filtered = filtered.replace(/\./g, "");
  }
  if (allowDecimals && decimalLimit !== undefined) {
    filtered = sanitizeDecimalInput(filtered, decimalLimit);
  }
  return filtered;
}

export function formatPhoneNumber(value: string, allowCountryCode?: boolean) {
  // Remove non-numeric characters and limit to 10 digits or 11 if country code is allowed
  const valueToFormat = value
    .replace(/\D/g, "")
    .substring(0, allowCountryCode ? 11 : 10);
  let valueToReturn = valueToFormat;
  if (allowCountryCode) {
    const countryCode = valueToFormat.substring(0, 1);
    const areaCode = valueToFormat.substring(1, 4);
    const middle = valueToFormat.substring(4, 7);
    const last = valueToFormat.substring(7, 11);

    if (valueToFormat.length > 7) {
      valueToReturn = `+${countryCode} (${areaCode}) ${middle}-${last}`;
    } else if (valueToFormat.length > 4) {
      valueToReturn = `+${countryCode} (${areaCode}) ${middle}`;
    } else if (valueToFormat.length > 1) {
      valueToReturn = `+${countryCode} (${areaCode}`;
    } else if (valueToFormat.length > 0) {
      valueToReturn = `+${countryCode}`;
    } else {
      valueToReturn = "";
    }
  } else {
    const areaCode = valueToFormat.substring(0, 3);
    const middle = valueToFormat.substring(3, 6);
    const last = valueToFormat.substring(6, 10);

    if (valueToFormat.length > 6) {
      valueToReturn = `${areaCode}-${middle}-${last}`;
    } else if (valueToFormat.length > 3) {
      valueToReturn = `${areaCode}-${middle}`;
    } else if (valueToFormat.length > 0) {
      valueToReturn = `${areaCode}`;
    } else {
      valueToReturn = "";
    }
  }
  return valueToReturn;
}
