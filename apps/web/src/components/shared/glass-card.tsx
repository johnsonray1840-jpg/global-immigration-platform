import { cn } from '@/lib/utils';

export function GlassCard({
  className,
  children,
  onClick,
}: {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'glass-card rounded-2xl border border-border/60 bg-card/80 text-card-foreground backdrop-blur-md shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md',
        className
      )}
    >
      {children}
    </div>
  );
}