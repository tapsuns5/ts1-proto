/**
 * NOTE: Update Radio.test.tsx with all additions and changes!
 */
export type RadioProps = {
  /**
   * disable turn into a toggle
   */
  disabled?: boolean
  /**
   * Help text is shown below the input wrapper
   */
  label?: string
  caption?: string
  /**
   * Children replaces the label text to allow for more complex labels with custom components
   */
  children?: React.ReactNode
  name?: string
  value?: string
  /**
   * Extra props are passed to the sub components/elements
   * use the name of the sub component/element as the key
   */
  extraProps?: {
    label?: {
      [x: string]: any
    } & React.HTMLAttributes<HTMLLabelElement>,
    input?: {
      [x: string]: any
    } & React.InputHTMLAttributes<HTMLInputElement>,
  }
  /**
   * Any other props to pass along (comment this out when running tests to catch prop errors)
   */
  [x: string]: any
}
