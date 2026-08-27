'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

interface AdminProduct {
  id: string
  slug: string
  nameEn: string
  category: string
  price: number
  inStock: boolean
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[] | null>(null)

  useEffect(() => {
    fetch('/api/admin/products')
      .then((r) => r.json())
      .then((data) => setProducts(data.products ?? []))
      .catch(() => setProducts([]))
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-body font-bold text-2xl text-cream">Products</h1>
        <Link
          href="/admin/products/new"
          className="px-4 py-2 rounded-full bg-amber text-bg text-sm font-semibold hover:bg-amber-bright transition-colors"
        >
          New product
        </Link>
      </div>

      {products === null ? (
        <p className="text-cream-muted">Loading…</p>
      ) : products.length === 0 ? (
        <p className="text-cream-muted">No products yet.</p>
      ) : (
        <div className="border border-ds-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-elevated text-cream-muted">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium">Category</th>
                <th className="text-left px-4 py-3 font-medium">Price</th>
                <th className="text-left px-4 py-3 font-medium">Stock</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-ds-border">
                  <td className="px-4 py-3 text-cream">{p.nameEn}</td>
                  <td className="px-4 py-3 text-cream-muted">{p.category}</td>
                  <td className="px-4 py-3 text-cream">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3">
                    <span className={p.inStock ? 'text-accent' : 'text-error'}>
                      {p.inStock ? 'In stock' : 'Out of stock'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/products/${p.id}`} className="text-accent hover:underline">
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
