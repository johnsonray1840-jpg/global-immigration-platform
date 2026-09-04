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
        'glass-card rounded-2xl border border-white/40 bg-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]',
        className
      )}
    >
      {children}
    </div>
  );
}