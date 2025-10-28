import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={clsx(
        'w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-ink shadow-sm transition focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/20',
        className
      )}
      {...props}
    />
  );
}
