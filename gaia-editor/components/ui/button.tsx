import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';
import * as React from 'react';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white hover:bg-primary/90',
        ghost: 'bg-transparent text-primary hover:bg-neutral-100',
        subtle: 'bg-white text-primary border border-muted/70 hover:border-primary/40',
        accent: 'bg-accent text-white hover:bg-accent/90'
      },
      size: {
        default: 'h-10 px-4 text-sm',
        sm: 'h-9 px-3 text-sm',
        lg: 'h-11 px-5 text-base',
        icon: 'h-10 w-10'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={clsx(buttonVariants({ variant, size }), className)}
        ref={ref as any}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
