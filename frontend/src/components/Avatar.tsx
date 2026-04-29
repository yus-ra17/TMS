import { cn } from '@/lib/utils';

export function Avatar({ name, className }: { name?: string | null; className?: string }) {
  const initial = (name?.trim()?.[0] || '?').toUpperCase();
  return (
    <div
      className={cn(
        'flex h-7 w-7 shrink-0 items-center justify-center rounded-full gradient-primary text-xs font-semibold text-primary-foreground',
        className,
      )}
    >
      {initial}
    </div>
  );
}
