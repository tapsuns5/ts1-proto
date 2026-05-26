/**
 * NOTE: Update Toggle.test.tsx with all additions and changes!
 */
export type ToggleProps = {
  /**
   * Booleans turn into a toggle
   */
  name: string
  /**
   * if onClick is defined, the toggle will be controlled
   * otherwise 'on' prop is used for 'defaultChecked
  */
 on?: boolean
 /**
   * set onClick to toggle the value of 'on' for controlled input
  */
 onClick?: (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => void
 disabled?: boolean
  /**
   * Any other props to pass along (comment this out when running tests to catch prop errors)
   */
  [x: string]: any
}
