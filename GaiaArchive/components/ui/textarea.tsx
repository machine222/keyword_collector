import clsx from 'clsx';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={clsx(
        'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink shadow-sm transition focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/20',
        className
      )}
      {...props}
    />
  );
}
