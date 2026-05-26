import * as React from 'react';
import { cn } from '../../utils';

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  selected?: boolean;
};
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, selected, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'sui-rounded sui-shadow-2 sui-border sui-border-solid sui-border-transparent sui-bg-white',
        // Note: If styles get complex move them outside and use the cva lib.
        { 'sui-bg-action-background-weak sui-border-action-border': selected },
        className
      )}
      {...props}
    />
  )
);
Card.displayName = 'Card';

/*
  Note: At the moment the Card component is a simple wrapper around a div element
  because the design system does not have a Card component per se. As for now we just want
  to standardize the look and feel of the Main Wrapper component, in the future once the Card
  concept is more defined we can add the rest of the Card components like CardHeader, CardFooter, etc.
*/
const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ ...props }, ref) => <header ref={ref} {...props} />
);
CardHeader.displayName = 'CardHeader';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ ...props }, ref) => <div ref={ref} {...props} />);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <footer ref={ref} {...props} />
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter };
