import { CategoriesManager } from '@/components/admin/CategoriesManager'

export default function AdminCategoriesPage() {
  return (
    <div>
      <h1 className="font-heading font-medium text-2xl text-cream mb-2">Categories</h1>
      <CategoriesManager />
    </div>
  )
}
