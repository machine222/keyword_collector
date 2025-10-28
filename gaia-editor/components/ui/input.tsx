import * as React from 'react';
import { clsx } from 'clsx';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type = 'text', ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={clsx(
          'flex h-11 w-full rounded-full border border-muted/70 bg-white px-4 text-sm text-primary shadow-sm transition placeholder:text-neutral-400 focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/10',
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';
