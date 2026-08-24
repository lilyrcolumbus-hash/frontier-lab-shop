'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useSupabaseUser } from '@/components/providers/AuthProvider'
import { GrowJournal } from '@/components/tools/GrowJournal'
import type { GrowJournalEntry } from '@/types/user'

export default function GrowJournalPage() {
  const t = useTranslations('tools.journal')
  const { user, loading } = useSupabaseUser()
  const [entries, setEntries] = useState<GrowJournalEntry[]>([])

  useEffect(() => {
    if (loading || !user) return
    fetch('/api/account/journal')
      .then((r) => r.json())
      .then((data) => setEntries(data.entries ?? []))
      .catch(() => setEntries([]))
  }, [loading, user])

  const handleAdd = async (entry: Omit<GrowJournalEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    const res = await fetch('/api/account/journal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    })
    if (!res.ok) return
    const { entry: created } = await res.json()
    setEntries((prev) => [created, ...prev])
  }

  const handleUpdateStatus = async (id: string, newStatus: GrowJournalEntry['status']) => {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e)))
    await fetch(`/api/account/journal/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
  }

  return (
    <div className="pt-20 min-h-screen">
      <div className="bg-surface border-b border-ds-border py-16 text-center">
        <p className="font-body font-light uppercase tracking-[0.2em] text-moss text-sm mb-3">Frontier Lab Tools</p>
        <h1 className="font-heading text-5xl font-bold text-cream mb-3">{t('title')}</h1>
        <p className="text-cream-muted text-lg">{t('subtitle')}</p>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <GrowJournal
          isAuthenticated={Boolean(user)}
          entries={entries}
          onAddEntry={handleAdd}
          onUpdateStatus={handleUpdateStatus}
        />
      </div>
    </div>
  )
}
