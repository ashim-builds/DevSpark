'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const buttonVariants = {
  primary: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500 active:scale-[0.98]',
  secondary: 'bg-dark-700 text-white hover:bg-dark-600 focus:ring-primary-500 active:scale-[0.98]',
  outline: 'border border-primary-500 text-primary-400 hover:bg-primary-500 hover:text-white focus:ring-primary-500 active:scale-[0.98]',
  ghost: 'text-surface-300 hover:text-white hover:bg-dark-800/60 focus:ring-dark-500',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 active:scale-[0.98]',
};

const buttonSizes = {
  sm: 'text-sm px-3 py-1.5',
  md: 'text-base px-4 py-2',
  lg: 'text-lg px-6 py-3',
  icon: 'p-2',
};

const Button = forwardRef(({
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  children,
  ...props
}, ref) => (
  <button
    ref={ref}
    disabled={disabled || isLoading}
    className={cn(
      'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
      buttonVariants[variant],
      buttonSizes[size],
      className
    )}
    {...props}
  >
    {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
    {children}
  </button>
));
Button.displayName = 'Button';

export { Button, buttonVariants, buttonSizes };
