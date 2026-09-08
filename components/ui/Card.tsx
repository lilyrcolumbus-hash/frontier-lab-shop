'use client'

import { useRef } from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  glow?: 'cyan' | 'violet' | 'gold' | false
  tilt?: boolean
  as?: 'div' | 'article' | 'section' | 'li'
}

export function Card({ children, className, hover, glow, tilt = false, as: Tag = 'div' }: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tilt || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    cardRef.current.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale3d(1.02,1.02,1.02)`
  }

  const handleMouseLeave = () => {
    if (!tilt || !cardRef.current) return
    cardRef.current.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)'
  }

  return (
    <Tag
      className={cn(
        'bg-elevated rounded-none border border-ds-border shadow-card',
        hover && 'transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-glow-cyan cursor-pointer',
        glow === 'cyan' && 'shadow-glow-cyan border-accent/20',
        glow === 'violet' && 'shadow-glow-violet border-violet/20',
        glow === 'gold' && 'shadow-glow-gold border-gold/20',
        className
      )}
    >
      {tilt ? (
        <div
          ref={cardRef}
          className="h-full w-full"
          style={{ transition: 'transform 0.1s ease-out', transformStyle: 'preserve-3d' }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {children}
        </div>
      ) : children}
    </Tag>
  )
}

interface CardSectionProps {
  children: React.ReactNode
  className?: string
}

export function CardHeader({ children, className }: CardSectionProps) {
  return <div className={cn('p-6 pb-0', className)}>{children}</div>
}

export function CardBody({ children, className }: CardSectionProps) {
  return <div className={cn('p-6', className)}>{children}</div>
}

export function CardFooter({ children, className }: CardSectionProps) {
  return <div className={cn('p-6 pt-0', className)}>{children}</div>
}
