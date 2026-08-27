'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface AdminSpecies {
  id: string
  slug: string
  commonName: string
  scientificName: string
  difficulty: string
}

export default function AdminSpeciesPage() {
  const [species, setSpecies] = useState<AdminSpecies[] | null>(null)

  useEffect(() => {
    fetch('/api/admin/species')
      .then((r) => r.json())
      .then((data) => setSpecies(data.species ?? []))
      .catch(() => setSpecies([]))
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-body font-bold text-2xl text-cream">Species</h1>
        <Link
          href="/admin/species/new"
          className="px-4 py-2 rounded-full bg-amber text-bg text-sm font-semibold hover:bg-amber-bright transition-colors"
        >
          New species
        </Link>
      </div>

      {species === null ? (
        <p className="text-cream-muted">Loading…</p>
      ) : species.length === 0 ? (
        <p className="text-cream-muted">No species yet.</p>
      ) : (
        <div className="border border-ds-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-elevated text-cream-muted">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Common name</th>
                <th className="text-left px-4 py-3 font-medium">Scientific name</th>
                <th className="text-left px-4 py-3 font-medium">Difficulty</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {species.map((s) => (
                <tr key={s.id} className="border-t border-ds-border">
                  <td className="px-4 py-3 text-cream">{s.commonName}</td>
                  <td className="px-4 py-3 text-cream-muted italic">{s.scientificName}</td>
                  <td className="px-4 py-3 text-cream-muted">{s.difficulty}</td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/species/${s.id}`} className="text-accent hover:underline">
                      Edit
                    </Link>
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
