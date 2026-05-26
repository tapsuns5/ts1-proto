import type {InputSize} from '../Input/Input.types'
/**
 * NOTE: Update Birthdate.test.tsx with all additions and changes!
 */
export type BirthdateProps = {
  
  name: string
  label?: string
  required?: boolean
  /**
   * pass the initial value to the input in format `YYYY-MM-DD`
   */
  value?: string
  /**
   * returns the full date string `YYYY-MM-DD` on change
   */
  onChange?: (date: string) => void
  /**
   * gives instant visual feedback on invalid date, still assumes form validation for submission
   */
  validate?: boolean
  /**
   * should display button to clear current values
   */
  showClearButton?: boolean;
  /**
   * Passes size to the Input instances
   */
  size?: InputSize
  className?: string
  /**
   * Passes errors from external validation if used
   */
  errors?: string[]
  inputProps?:
    | React.InputHTMLAttributes<HTMLInputElement>
}
