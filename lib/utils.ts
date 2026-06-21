import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(cents: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(cents / 100)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function truncate(text: string, length: number): string {
  return text.length > length ? `${text.slice(0, length)}…` : text
}

export function tempFtoC(f: number): number {
  return Math.round(((f - 32) * 5) / 9)
}

export function tempCtoF(c: number): number {
  return Math.round((c * 9) / 5 + 32)
}

export function lbsToKg(lbs: number): number {
  return Math.round(lbs * 0.453592 * 100) / 100
}

export function kgToLbs(kg: number): number {
  return Math.round(kg * 2.20462 * 100) / 100
}
