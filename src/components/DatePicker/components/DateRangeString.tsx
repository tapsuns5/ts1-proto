import * as React from 'react';
import { createDateString } from '../utils';
import Icon from '../../Icon/Icon';
import { cn } from '../../../utils';

export function DateRangeString({
  dateValues,
  dateJustSelected = 'start',
  isPopoverOpen,
}: {
  dateValues?: [Date | undefined, Date | undefined];
  dateJustSelected: 'start' | 'end' | undefined;
  isPopoverOpen?: boolean;
}) {
  if (!dateValues || (dateValues[0] === undefined && dateValues[1] === undefined)) {
    return null;
  }

  const showStartBox = isPopoverOpen && dateJustSelected === 'start';
  const showEndBox = isPopoverOpen && dateJustSelected === 'end';

  return (
    <span className='sui-flex sui-flex-row sui-gap-1 sui-items-center'>
      <Icon name='calendar_month' size='s' className='sui-text-neutral-icon-medium' />

      <span
        className={cn(
          'sui-flex sui-flex-row sui-gap-1 sui-items-center sui-justify-center sui-p-[4px_8px] sui-rounded-[10px]',
          showStartBox ? 'sui-border sui-border-solid sui-border-action-border/100' : ''
        )}
      >
        {dateValues[0] ? createDateString(dateValues[0]) : ''}
      </span>
      {' - '}
      <span
        className={cn(
          'sui-flex sui-flex-row sui-gap-1 sui-items-center sui-justify-center sui-p-[4px_8px] sui-rounded-[10px]',
          showEndBox ? 'sui-border sui-border-solid sui-border-action-border/100' : ''
        )}
      >
        {dateValues[1] ? createDateString(dateValues[1]) : ''}
      </span>
    </span>
  );
}
