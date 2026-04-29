import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: Props) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 p-16 text-center animate-fade-in',
        className,
      )}
    >
      <div className="relative">
        <div className="absolute inset-0 rounded-2xl gradient-primary opacity-20 blur-xl" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-soft text-primary mb-4">
          <Icon className="h-7 w-7" />
        </div>
      </div>
      <h3 className="text-lg font-semibold mt-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
