import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  colorClass?: string;
  dotClass?: string;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, colorClass = 'bg-slate-100 text-slate-700', dotClass, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
          colorClass,
          className
        )}
        {...props}
      >
        {dotClass && <span className={cn('w-1.5 h-1.5 rounded-full', dotClass)} />}
        {children}
      </span>
    );
  }
);
Badge.displayName = 'Badge';
