import * as React from 'react';
import { clsx } from 'clsx';

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={clsx(
          'w-full rounded-2xl border border-muted/70 bg-white px-4 py-3 text-sm text-primary shadow-sm transition placeholder:text-neutral-400 focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/10',
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';
