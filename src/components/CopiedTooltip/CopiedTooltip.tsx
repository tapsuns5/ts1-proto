import {
  cloneElement,
  isValidElement,
  useEffect,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import IconButton from '../IconButton/IconButton';
import Tooltip, { TooltipProvider, TooltipTrigger } from '../Tooltip/Tooltip';
import type { CopiedTooltipProps } from './CopiedTooltip.types';
import { TooltipAnimation } from './TooltipAnimation';

const COPY_DISAPPEAR_DELAY = 2000;

export function CopiedTooltip({
  disabled,
  copyLabel = 'Copy link',
  textToCopy,
  children,
}: CopiedTooltipProps): ReactNode {
  const [isCopied, setIsCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => setIsCopied(false), COPY_DISAPPEAR_DELAY);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  const handleCopy = async () => {
    if (disabled) {
      return;
    }
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const childWithOnClick = isValidElement(children)
    ? cloneElement(children as ReactElement, {
        onClick: (e: React.MouseEvent) => {
          if (typeof children.props.onClick === 'function' && !disabled) {
            children.props.onClick(e);
          }
          handleCopy();
        },
      })
    : children;

  return (
    <div className="sui-relative sui-inline-flex sui-flex-col sui-items-center sui-justify-center">
      <TooltipAnimation isVisible={isCopied} />

      <TooltipProvider delayDuration={200}>
        <Tooltip
          open={isOpen && !isCopied}
          content={
            <span data-testid="copied-tooltip-content">{copyLabel}</span>
          }
        >
          <TooltipTrigger
            asChild
            onMouseEnter={() => !disabled && setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
          >
            {childWithOnClick || (
              <IconButton
                icon="link"
                onClick={handleCopy}
                disabled={disabled}
                data-testid="copied-tooltip-button"
                aria-label="Copy link"
              />
            )}
          </TooltipTrigger>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
