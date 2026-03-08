import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  wrapperClassName?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, wrapperClassName, children, ...props }, ref) => {
    return (
      <div className={cn("relative", wrapperClassName || "w-full")}>
        <select
          ref={ref}
          className={cn(
            'flex w-full appearance-none border border-slate-200 rounded-xl px-4 py-3 pr-10 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors bg-white',
            error && 'border-red-300 focus:ring-red-500',
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        {error && (
          <span className="text-red-500 text-xs mt-1 block absolute -bottom-5 left-0">
            {error}
          </span>
        )}
      </div>
    );
  }
);
Select.displayName = 'Select';
