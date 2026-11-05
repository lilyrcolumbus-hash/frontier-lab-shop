'use client'

import { useCallback, useEffect, useState } from 'react'

interface AdminCategory {
  id: string
  slug: string
  nameEn: string
  nameEs: string
  descriptionEn: string
  descriptionEs: string
  parentId: string | null
  sortOrder: number
  showInMenu: boolean
  showPacketContents: boolean | null
  showViabilityGuarantee: boolean | null
  showFreshnessBlock: boolean | null
  productCount: number
  childCount: number
}

type BlockKey = 'showPacketContents' | 'showViabilityGuarantee' | 'showFreshnessBlock'

const BLOCKS: { key: BlockKey; title: string; help: string }[] = [
  { key: 'showPacketContents', title: '"What\'s in the packet"', help: 'Syringe, needle, swab and card. Only for liquid culture syringes.' },
  { key: 'showViabilityGuarantee', title: '"Viable culture guaranteed"', help: 'The replace-or-refund promise for products that arrive alive. Leave off for powders, tools and equipment.' },
  { key: 'showFreshnessBlock', title: '"How we guarantee it arrives fresh"', help: 'Lab-isolated genetics and the shipping promise. Only for live cultures.' },
]

const inputClass = 'w-full bg-surface border border-ds-border rounded-none px-3 py-2 text-cream text-sm'
const smallButton = 'px-2.5 py-1 text-xs border border-ds-border text-cream-muted hover:text-cream hover:border-cream transition-colors disabled:opacity-40'

export function CategoriesManager() {
  const [categories, setCategories] = useState<AdminCategory[] | null>(null)
  const [loadError, setLoadError] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [openId, setOpenId] = useState<string | null>(null)
  const [adding, setAdding] = useState<string | 'top' | null>(null)
  const [newName, setNewName] = useState('')

  const load = useCallback(async () => {
    setLoadError('')
    try {
      const res = await fetch('/api/admin/categories')
      const data = await res.json().catch(() => null)
      if (!res.ok) throw new Error(data?.error ?? 'Could not load categories')
      setCategories(data.categories)
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : 'Could not reach the server. Check your connection and try again.')
    }
  }, [])

  useEffect(() => { void load() }, [load])

  // One helper for every change: a failure of any kind shows a message and re-enables the buttons.
  const send = async (url: string, method: string, body?: unknown): Promise<boolean> => {
    setBusy(true)
    setError('')
    try {
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: body === undefined ? undefined : JSON.stringify(body) })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        setError(data?.error ?? 'Could not save. Try again.')
        return false
      }
      await load()
      return true
    } catch {
      setError('Could not reach the server. Your change was not saved. Check your connection and try again.')
      return false
    } finally {
      setBusy(false)
    }
  }

  const add = async () => {
    const name = newName.trim()
    if (!name) return
    const ok = await send('/api/admin/categories', 'POST', { name, parentId: adding === 'top' ? null : adding })
    if (ok) { setNewName(''); setAdding(null) }
  }

  const remove = async (c: AdminCategory) => {
    const label = c.parentId ? 'subcategory' : 'category'
    if (!window.confirm(`Delete the ${label} "${c.nameEn}"? This cannot be undone.`)) return
    await send(`/api/admin/categories/${c.id}`, 'DELETE')
  }

  if (loadError) {
    return (
      <div className="border border-ds-border bg-surface p-5">
        <p className="text-sm text-error mb-3">{loadError}</p>
        <button type="button" className={smallButton} onClick={load}>Try again</button>
      </div>
    )
  }
  if (!categories) return <p className="text-sm text-cream-muted">Loading…</p>

  const tops = categories.filter((c) => c.parentId === null)
  const childrenOf = (id: string) => categories.filter((c) => c.parentId === id)

  const row = (c: AdminCategory, index: number, siblings: AdminCategory[]) => {
    const isTop = c.parentId === null
    const open = openId === c.id
    return (
      <div key={c.id} className={isTop ? 'border border-ds-border bg-surface' : 'border-t border-ds-border'}>
        <div className={`flex flex-wrap items-center gap-3 px-4 py-3 ${isTop ? '' : 'pl-10'}`}>
          <div className="flex flex-col">
            <button type="button" aria-label="Move up" className="text-cream-muted hover:text-cream disabled:opacity-30 leading-none" disabled={busy || index === 0} onClick={() => send(`/api/admin/categories/${c.id}`, 'PATCH', { move: 'up' })}>▲</button>
            <button type="button" aria-label="Move down" className="text-cream-muted hover:text-cream disabled:opacity-30 leading-none mt-0.5" disabled={busy || index === siblings.length - 1} onClick={() => send(`/api/admin/categories/${c.id}`, 'PATCH', { move: 'down' })}>▼</button>
          </div>
          <div className="min-w-0 flex-1">
            <div className={isTop ? 'font-medium text-cream' : 'text-cream text-sm'}>{c.nameEn}</div>
            <div className="text-xs font-mono text-cream-muted">{c.slug} · {c.productCount} product{c.productCount === 1 ? '' : 's'}</div>
          </div>
          {isTop && (
            <label className="flex items-center gap-2 text-xs text-cream-muted cursor-pointer">
              <input type="checkbox" checked={c.showInMenu} disabled={busy} onChange={(e) => send(`/api/admin/categories/${c.id}`, 'PATCH', { showInMenu: e.target.checked })} />
              Show in menu
            </label>
          )}
          <button type="button" className={smallButton} onClick={() => setOpenId(open ? null : c.id)}>{open ? 'Close' : 'Edit'}</button>
          <button type="button" className={`${smallButton} hover:!text-error hover:!border-error`} disabled={busy} onClick={() => remove(c)}>Delete</button>
        </div>
        {open && <EditPanel key={c.id} category={c} busy={busy} onSave={(body) => send(`/api/admin/categories/${c.id}`, 'PATCH', body)} />}
      </div>
    )
  }

  return (
    <div>
      <p className="text-sm text-cream-muted mb-6 max-w-2xl">
        Categories and subcategories organize the shop. The top-level ones become the menu and the tabs on the shop page, and the order here is the order there.
        When you create a product you pick from these lists.
      </p>

      {error && <p role="alert" className="text-sm text-error mb-4">{error}</p>}

      <div className="space-y-4">
        {tops.map((top, i) => (
          <div key={top.id}>
            {row(top, i, tops)}
            <div className="border border-t-0 border-ds-border bg-surface">
              {childrenOf(top.id).map((sub, j, list) => row(sub, j, list))}
              <div className="border-t border-ds-border px-4 py-2 pl-10">
                {adding === top.id ? (
                  <AddInline value={newName} onChange={setNewName} onAdd={add} onCancel={() => { setAdding(null); setNewName('') }} busy={busy} placeholder="Subcategory name" />
                ) : (
                  <button type="button" className="text-xs text-cream-muted hover:text-cream" onClick={() => { setAdding(top.id); setNewName('') }}>+ Add subcategory</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        {adding === 'top' ? (
          <AddInline value={newName} onChange={setNewName} onAdd={add} onCancel={() => { setAdding(null); setNewName('') }} busy={busy} placeholder="Category name" />
        ) : (
          <button type="button" className="px-4 py-2 rounded-none bg-cream text-surface text-sm font-semibold hover:bg-cream/90" onClick={() => { setAdding('top'); setNewName('') }}>Add category</button>
        )}
      </div>
    </div>
  )
}

function AddInline({ value, onChange, onAdd, onCancel, busy, placeholder }: { value: string; onChange: (v: string) => void; onAdd: () => void; onCancel: () => void; busy: boolean; placeholder: string }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <input className={`${inputClass} max-w-xs`} value={value} placeholder={placeholder} autoFocus maxLength={80}
        onChange={(e) => onChange(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); onAdd() } if (e.key === 'Escape') onCancel() }} />
      <button type="button" className="px-3 py-2 bg-cream text-surface text-xs font-semibold disabled:opacity-50" disabled={busy || !value.trim()} onClick={onAdd}>{busy ? 'Adding…' : 'Add'}</button>
      <button type="button" className={smallButton} onClick={onCancel}>Cancel</button>
    </div>
  )
}

function EditPanel({ category, busy, onSave }: { category: AdminCategory; busy: boolean; onSave: (body: Record<string, unknown>) => Promise<boolean> }) {
  const isTop = category.parentId === null
  const [nameEn, setNameEn] = useState(category.nameEn)
  const [nameEs, setNameEs] = useState(category.nameEs)
  const [descEn, setDescEn] = useState(category.descriptionEn)
  const [descEs, setDescEs] = useState(category.descriptionEs)
  const [blocks, setBlocks] = useState<Record<BlockKey, boolean | null>>({
    showPacketContents: category.showPacketContents,
    showViabilityGuarantee: category.showViabilityGuarantee,
    showFreshnessBlock: category.showFreshnessBlock,
  })
  const [saved, setSaved] = useState(false)

  const save = async () => {
    setSaved(false)
    const ok = await onSave({
      nameEn, nameEs: nameEs.trim() || nameEn,
      ...(isTop ? { descriptionEn: descEn, descriptionEs: descEs } : {}),
      ...blocks,
    })
    if (ok) setSaved(true)
  }

  const toValue = (v: boolean | null) => (v === null ? '' : v ? 'true' : 'false')
  const fromValue = (s: string): boolean | null => (s === '' ? null : s === 'true')

  return (
    <div className="border-t border-ds-border bg-bg px-4 py-4 space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block text-xs text-cream-muted">Name (English)
          <input className={`${inputClass} mt-1`} value={nameEn} maxLength={80} onChange={(e) => setNameEn(e.target.value)} />
        </label>
        <label className="block text-xs text-cream-muted">Name in Spanish
          <input className={`${inputClass} mt-1`} value={nameEs} maxLength={80} onChange={(e) => setNameEs(e.target.value)} />
        </label>
        {isTop && (
          <>
            <label className="block text-xs text-cream-muted">One line under the name in the menu (English)
              <input className={`${inputClass} mt-1`} value={descEn} maxLength={200} onChange={(e) => setDescEn(e.target.value)} />
            </label>
            <label className="block text-xs text-cream-muted">The same, in Spanish
              <input className={`${inputClass} mt-1`} value={descEs} maxLength={200} onChange={(e) => setDescEs(e.target.value)} />
            </label>
          </>
        )}
      </div>

      <div>
        <p className="text-xs font-mono uppercase tracking-[0.18em] text-cream-muted mb-2">Product page</p>
        <p className="text-xs text-cream-muted mb-3">
          Choose which extra blocks the page of every product in this {isTop ? 'category' : 'subcategory'} shows. They are claims, so turn on only what is true for these products.
        </p>
        <div className="space-y-3">
          {BLOCKS.map((b) => (
            <div key={b.key} className="flex flex-wrap items-start gap-3">
              <select
                className="bg-surface border border-ds-border rounded-none px-2 py-1.5 text-cream text-xs w-44"
                value={toValue(blocks[b.key])}
                onChange={(e) => setBlocks((prev) => ({ ...prev, [b.key]: fromValue(e.target.value) }))}
              >
                {!isTop && <option value="">Same as the category</option>}
                {isTop && <option value="">Off</option>}
                <option value="true">On</option>
                <option value="false">Off</option>
              </select>
              <div className="min-w-0 flex-1">
                <div className="text-sm text-cream">{b.title}</div>
                <div className="text-xs text-cream-muted">{b.help}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button type="button" className="px-4 py-2 bg-cream text-surface text-sm font-semibold disabled:opacity-50" disabled={busy || !nameEn.trim()} onClick={save}>{busy ? 'Saving…' : 'Save changes'}</button>
        {saved && <span className="text-xs text-accent">Saved</span>}
      </div>
    </div>
  )
}
