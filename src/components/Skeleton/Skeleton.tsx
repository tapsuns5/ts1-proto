import React from 'react';
import { cn } from '../../utils';
import s from './Skeleton.module.scss';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'sui-rounded-[9999px] sui-h-2 sui-w-2 sui-bg-gray-90',
        s.snapUiSkeletonPulseAnimation,
        className
      )}
      {...props}
    />
  );
}

export default Skeleton;
