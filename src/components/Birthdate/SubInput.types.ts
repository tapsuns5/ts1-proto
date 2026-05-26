import type { NativeSelectOption } from "../Input/Input.types";

/**
 * NOTE: Update SubInput.test.tsx with all additions and changes!
 */
export type SubInputProps = {
  type:
  | 'text'
  | 'select';
name: string;
label?: string;
placeholder?: string;
disabled?: boolean;
onChange?: (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => void;
onBlur?: (
  e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => void;
value?: string;
inputProps?:
  | React.InputHTMLAttributes<HTMLInputElement>
  | React.SelectHTMLAttributes<HTMLSelectElement>;
options?: NativeSelectOption[];
/**
 * used to show error border style without message
 */
errorState?: boolean;
/**
 * apply classes to the outer wrapper
 */
className?: string;
/**
 * All other props to pass along (comment this out when running tests to catch prop errors)
 */
[x: string]: unknown;
};


