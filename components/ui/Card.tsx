import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverable, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-white border border-slate-200 rounded-2xl shadow-sm transition-all',
          hoverable && 'hover:shadow-md hover:border-slate-300',
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = 'Card';
