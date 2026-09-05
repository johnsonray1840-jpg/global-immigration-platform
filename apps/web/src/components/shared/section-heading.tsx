import { cn } from '@/lib/utils';

export function SectionHeading({
  title,
  subtitle,
  className,
  centered,
}: {
  title: string;
  subtitle?: string;
  className?: string;
  centered?: boolean;
}) {
  return (
    <div className={cn('mb-10', centered ? 'text-center' : '', className)}>
      <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className={cn("mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg", centered ? 'text-center' : '')}>
          {subtitle}
        </p>
      )}
    </div>
  );
}