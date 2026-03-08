import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full relative">
        <input
          ref={ref}
          className={cn(
            'flex w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors placeholder:text-slate-400 bg-white',
            error && 'border-red-300 focus:ring-red-500',
            className
          )}
          {...props}
        />
        {error && (
          <span className="text-red-500 text-xs mt-1 block absolute -bottom-5 left-0">
            {error}
          </span>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
