import * as React from 'react';
import { clsx } from 'clsx';

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        'rounded-3xl border border-muted/60 bg-white/90 p-6 shadow-sm shadow-black/5 backdrop-blur transition hover:shadow-md hover:shadow-black/5',
        className
      )}
      {...props}
    />
  );
}
