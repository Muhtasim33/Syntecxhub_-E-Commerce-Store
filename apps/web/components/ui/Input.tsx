'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold uppercase tracking-wider text-emerald-950/80"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            'w-full px-3.5 py-2.5 rounded-lg border border-cream-300 bg-cream-100/60 text-emerald-950 placeholder:text-emerald-950/40 text-sm transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-olive-800 focus:border-transparent focus:bg-cream-100',
            error && 'border-red-600 focus:ring-red-600',
            className
          )}
          {...props}
        />
        {error ? (
          <span className="text-xs text-red-700 font-medium">{error}</span>
        ) : helperText ? (
          <span className="text-xs text-emerald-950/60">{helperText}</span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
