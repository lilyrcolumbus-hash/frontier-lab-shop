'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export function AnalyticsRangePicker({
  value,
  options,
}: {
  value: string
  options: { key: string; label: string }[]
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  return (
    <select
      value={value}
      onChange={(e) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('range', e.target.value)
        router.push(`/admin?${params.toString()}`)
      }}
      className="px-3.5 py-2 rounded-none border border-ds-border bg-surface text-sm text-cream"
    >
      {options.map((option) => (
        <option key={option.key} value={option.key}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
