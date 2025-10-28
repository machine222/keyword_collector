import clsx from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
}

export function Card({ className, elevated = false, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow',
        elevated && 'shadow-lg shadow-slate-200/60',
        className
      )}
      {...props}
    />
  );
}
