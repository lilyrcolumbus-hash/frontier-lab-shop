'use client'

import { cn } from '@/lib/utils'
import { type ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  fullWidth?: boolean
}

const variants = {
  primary:
    'bg-amber text-bg font-semibold shadow-glow-amber-sm hover:bg-amber-bright hover:shadow-glow-amber active:scale-95',
  secondary:
    'bg-accent/20 text-accent border border-accent/30 hover:bg-accent/30 active:scale-95',
  outline:
    'border border-accent/30 hover:border-accent/60 text-accent hover:bg-accent/8 active:scale-95',
  ghost:
    'text-cream-muted hover:text-cream hover:bg-elevated active:scale-95',
  danger:
    'bg-error hover:bg-error/80 text-cream active:scale-95',
}

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, fullWidth, className, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled ?? isLoading}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-none font-body font-medium transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>{children}</span>
          </>
        ) : children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
