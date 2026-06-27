'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { GrowJournal } from '@/components/tools/GrowJournal'
import type { GrowJournalEntry } from '@/types/user'

export default function GrowJournalPage() {
  const t = useTranslations('tools.journal')
  const [entries, setEntries] = useState<GrowJournalEntry[]>([])

  const handleAdd = (entry: Omit<GrowJournalEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    const newEntry: GrowJournalEntry = {
      ...entry,
      id: Math.random().toString(36).slice(2),
      userId: 'demo',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setEntries((prev) => [newEntry, ...prev])
  }

  const handleUpdateStatus = (id: string, status: GrowJournalEntry['status']) => {
    setEntries((prev) => prev.map((e) => e.id === id ? { ...e, status, updatedAt: new Date() } : e))
  }

  return (
    <div className="pt-20 min-h-screen">
      <div className="bg-surface border-b border-ds-border py-16 text-center">
        <p className="font-body font-light uppercase tracking-[0.2em] text-moss text-sm mb-3">Shrooms Tools</p>
        <h1 className="font-heading text-5xl font-bold text-cream mb-3">📔 {t('title')}</h1>
        <p className="text-cream-muted text-lg">{t('subtitle')}</p>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <GrowJournal
          isAuthenticated={true}
          entries={entries}
          onAddEntry={handleAdd}
          onUpdateStatus={handleUpdateStatus}
        />
      </div>
    </div>
  )
}
