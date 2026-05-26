/**
 * NOTE: Update Avatar.test.tsx with all additions and changes!
 */
export type AvatarProps = {
  type: 'picture' | 'initials' | 'placeholder'
  size?: 'default' | 'small' | 'large' | 'xl'
  initials?: React.ReactNode
  src?: string
  /**
   * Any other props to pass along (comment this out when running tests to catch prop errors)
   */
  [x: string]: any
}
