import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  glow?: 'accent' | 'success' | false
  as?: 'div' | 'article' | 'section' | 'li'
}

export function Card({
  children,
  className,
  hover,
  glow,
  as: Tag = 'div',
}: CardProps) {
  return (
    <Tag
      className={cn(
        'bg-elevated rounded-2xl border border-ds-border shadow-card',
        hover && 'transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-glow-accent cursor-pointer',
        glow === 'accent' && 'shadow-glow-accent',
        glow === 'success' && 'shadow-glow-success',
        className
      )}
    >
      {children}
    </Tag>
  )
}

interface CardHeaderProps {
  children: React.ReactNode
  className?: string
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn('p-6 pb-0', className)}>{children}</div>
  )
}

export function CardBody({ children, className }: CardHeaderProps) {
  return (
    <div className={cn('p-6', className)}>{children}</div>
  )
}

export function CardFooter({ children, className }: CardHeaderProps) {
  return (
    <div className={cn('p-6 pt-0', className)}>{children}</div>
  )
}
