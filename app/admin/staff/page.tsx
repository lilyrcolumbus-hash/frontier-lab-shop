'use client'

import { useState } from 'react'
import { useAdminList } from '@/components/admin/useAdminList'
import { ListState } from '@/components/admin/ListState'

interface StaffMember {
  id: string
  userId: string
  role: 'owner' | 'staff'
  email: string
  createdAt: string
}

export default function AdminStaffPage() {
  const { data: staff, error, reload } = useAdminList<StaffMember>('/api/admin/staff', 'staff')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'owner' | 'staff'>('staff')
  const [busy, setBusy] = useState(false)
  const [formError, setFormError] = useState('')

  const invite = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setFormError('')
    const res = await fetch('/api/admin/staff', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, role }),
    })
    const data = await res.json().catch(() => null)
    setBusy(false)
    if (!res.ok) {
      setFormError(data?.error ?? 'Could not add that person')
      return
    }
    setEmail('')
    void reload()
  }

  const changeRole = async (member: StaffMember, next: 'owner' | 'staff') => {
    const res = await fetch(`/api/admin/staff/${member.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: next }),
    })
    const data = await res.json().catch(() => null)
    if (!res.ok) {
      setFormError(data?.error ?? 'Could not change that role')
      return
    }
    setFormError('')
    void reload()
  }

  const remove = async (member: StaffMember) => {
    if (!window.confirm(`Remove ${member.email}'s access to this store?`)) return
    const res = await fetch(`/api/admin/staff/${member.id}`, { method: 'DELETE' })
    const data = await res.json().catch(() => null)
    if (!res.ok) {
      setFormError(data?.error ?? 'Could not remove that person')
      return
    }
    setFormError('')
    void reload()
  }

  return (
    <div className="max-w-3xl">
      <h1 className="font-body font-bold text-2xl text-cream mb-2">Staff</h1>
      <p className="text-sm text-cream-muted mb-6">
        Owners can change store settings, create discounts, issue refunds and manage staff. Staff
        can run the catalog and fulfil orders, but cannot move money or grant access.
      </p>

      <form onSubmit={invite} className="bg-surface border border-ds-border rounded-xl p-5 mb-6 space-y-3">
        <h2 className="text-sm font-medium text-cream">Give someone access</h2>
        <p className="text-xs text-cream-muted/70">
          They need a Frontier Lab account first — access is granted to an existing account, not
          sent as an invitation email.
        </p>
        <div className="flex flex-wrap gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="their@email.com"
            className="flex-1 min-w-[220px] px-3.5 py-2 rounded-lg border border-ds-border bg-bg text-sm text-cream placeholder:text-cream-muted"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as 'owner' | 'staff')}
            className="px-3.5 py-2 rounded-lg border border-ds-border bg-bg text-sm text-cream"
          >
            <option value="staff">Staff</option>
            <option value="owner">Owner</option>
          </select>
          <button
            type="submit"
            disabled={busy}
            className="px-4 py-2 rounded-lg bg-cream text-surface text-sm font-semibold hover:bg-cream/90 transition-colors disabled:opacity-50"
          >
            {busy ? 'Adding…' : 'Add'}
          </button>
        </div>
        {formError && <p className="text-sm text-error">{formError}</p>}
      </form>

      {staff === null ? (
        <ListState error={error} onRetry={reload} />
      ) : (
        <div className="border border-ds-border rounded-xl bg-surface overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-elevated text-cream-muted">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-[11px] uppercase tracking-wider">Person</th>
                <th className="text-left px-4 py-3 font-medium text-[11px] uppercase tracking-wider">Role</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {staff.map((member) => (
                <tr key={member.id} className="border-t border-ds-border">
                  <td className="px-4 py-3 text-cream">{member.email}</td>
                  <td className="px-4 py-3">
                    <select
                      value={member.role}
                      onChange={(e) => changeRole(member, e.target.value as 'owner' | 'staff')}
                      className="px-2.5 py-1.5 rounded-lg border border-ds-border bg-bg text-xs text-cream"
                    >
                      <option value="staff">Staff</option>
                      <option value="owner">Owner</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => remove(member)}
                      className="text-xs text-error hover:underline"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
