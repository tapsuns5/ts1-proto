import React from 'react';
import classes from './HelpText.module.scss';
import { HelpTextProps } from './HelpText.types';

/**
 * Pretty much just a styled span tag!
  - The primary component has:
    - CSS modules
    - Tailwind styles
    - CSS variables
  - To make sure all different CSS channels are working
  */
const HelpText: React.FC<HelpTextProps> = ({ children, className = '', ...props }) => {
  return (
    <span
      data-testid='help-text-component'
      className={[classes['help-text'], className].join(' ')}
      {...props}
    >
      {children}
    </span>
  );
};

export default HelpText;
