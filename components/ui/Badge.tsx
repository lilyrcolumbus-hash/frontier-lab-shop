import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error' | 'accent' | 'moss' | 'outline'
  size?: 'sm' | 'md'
  className?: string
}

const variants = {
  default: 'bg-elevated text-cream-muted border border-ds-border',
  success: 'bg-success/15 text-success border border-success/30',
  warning: 'bg-warning/15 text-warning border border-warning/30',
  error: 'bg-error/15 text-error border border-error/30',
  accent: 'bg-accent/15 text-accent border border-accent/30',
  moss: 'bg-moss/15 text-moss border border-moss/30',
  outline: 'border border-cream/30 text-cream-muted',
}

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
}

export function Badge({ children, variant = 'default', size = 'sm', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-none font-body font-medium',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  )
}
