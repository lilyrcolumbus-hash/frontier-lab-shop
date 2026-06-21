'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import type { GrowJournalEntry } from '@/types/user'
import { cn } from '@/lib/utils'

const STATUS_COLORS: Record<GrowJournalEntry['status'], 'default' | 'moss' | 'warning' | 'accent' | 'success'> = {
  inoculated: 'default',
  colonizing: 'moss',
  pinning: 'warning',
  fruiting: 'accent',
  harvested: 'success',
}

const STATUS_ICONS: Record<GrowJournalEntry['status'], string> = {
  inoculated: '💉',
  colonizing: '🌐',
  pinning: '📍',
  fruiting: '🍄',
  harvested: '✅',
}

interface GrowJournalProps {
  isAuthenticated: boolean
  entries: GrowJournalEntry[]
  onAddEntry: (entry: Omit<GrowJournalEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void
  onUpdateStatus: (id: string, status: GrowJournalEntry['status']) => void
}

export function GrowJournal({ isAuthenticated, entries, onAddEntry, onUpdateStatus }: GrowJournalProps) {
  const t = useTranslations('tools.journal')

  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    species: '',
    speciesSlug: '',
    method: '',
    substrate: '',
    startDate: new Date().toISOString().split('T')[0],
    notes: '',
    status: 'inoculated' as GrowJournalEntry['status'],
    photos: [] as string[],
  })

  const statuses = ['inoculated', 'colonizing', 'pinning', 'fruiting', 'harvested'] as const

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-6 text-center">
        <span className="text-6xl">📔</span>
        <h3 className="font-heading text-2xl text-cream">{t('loginRequired')}</h3>
        <Link href="/account"><Button>{t('signIn')}</Button></Link>
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddEntry({ ...form, startDate: new Date(form.startDate) })
    setShowForm(false)
    setForm({ species: '', speciesSlug: '', method: '', substrate: '', startDate: new Date().toISOString().split('T')[0], notes: '', status: 'inoculated', photos: [] })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-semibold text-cream">{t('title')}</h2>
        <Button onClick={() => setShowForm(true)} size="sm">
          + {t('newEntry')}
        </Button>
      </div>

      {/* New entry form */}
      {showForm && (
        <div className="bg-elevated rounded-2xl border border-ds-border p-6 animate-fade-in">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={t('fields.species')}
                value={form.species}
                onChange={(e) => setForm({ ...form, species: e.target.value })}
                placeholder="e.g. Blue Oyster"
                required
              />
              <Input
                label={t('fields.method')}
                value={form.method}
                onChange={(e) => setForm({ ...form, method: e.target.value })}
                placeholder="e.g. Grain spawn + sawdust blocks"
                required
              />
              <Input
                label={t('fields.substrate')}
                value={form.substrate}
                onChange={(e) => setForm({ ...form, substrate: e.target.value })}
                placeholder="e.g. Hardwood sawdust"
              />
              <Input
                label={t('fields.startDate')}
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-cream-muted mb-1.5">{t('fields.notes')}</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3}
                placeholder="Add notes..."
                className="w-full bg-surface border border-ds-border rounded-xl px-4 py-3 text-cream placeholder:text-cream-muted/60 font-body text-base focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent resize-none"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit">Save Entry</Button>
            </div>
          </form>
        </div>
      )}

      {/* Entries */}
      {entries.length === 0 && !showForm ? (
        <div className="text-center py-16">
          <span className="text-5xl block mb-4">🌱</span>
          <p className="text-cream-muted">{t('noEntries')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <div key={entry.id} className="bg-elevated rounded-2xl border border-ds-border p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-heading text-xl font-semibold text-cream">{entry.species}</h3>
                  <p className="text-sm text-cream-muted mt-0.5">
                    Started {new Date(entry.startDate).toLocaleDateString()} · {entry.method}
                  </p>
                </div>
                <Badge variant={STATUS_COLORS[entry.status]}>
                  {STATUS_ICONS[entry.status]} {t(`status.${entry.status}`)}
                </Badge>
              </div>

              {/* Status progression */}
              <div className="flex items-center gap-1 mt-4 overflow-x-auto pb-1">
                {statuses.map((s) => {
                  const idx = statuses.indexOf(s)
                  const currentIdx = statuses.indexOf(entry.status)
                  return (
                    <button
                      key={s}
                      onClick={() => onUpdateStatus(entry.id, s)}
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors',
                        idx <= currentIdx
                          ? 'bg-accent/20 text-accent border border-accent/30'
                          : 'bg-surface text-cream-muted border border-ds-border hover:border-accent/30'
                      )}
                    >
                      {STATUS_ICONS[s]} {t(`status.${s}`)}
                    </button>
                  )
                })}
              </div>

              {entry.notes && (
                <p className="text-sm text-cream-muted mt-3 italic">{entry.notes}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
