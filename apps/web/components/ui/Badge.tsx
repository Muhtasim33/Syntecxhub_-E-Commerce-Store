import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'gold' | 'outline';
}

export function Badge({
  className,
  variant = 'default',
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default: 'bg-cream-300 text-emerald-950',
    success: 'bg-emerald-950 text-cream-100 border border-emerald-900',
    warning: 'bg-amber-100 text-amber-900 border border-amber-300',
    danger: 'bg-red-100 text-red-900 border border-red-300',
    gold: 'bg-[#c9a96e]/20 text-[#7a5e2a] border border-[#c9a96e]/40',
    outline: 'border border-cream-300 text-emerald-950 bg-transparent',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide uppercase',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
