import { useState } from 'react'
import { Check, Pencil, Plus, Trash2, X } from 'lucide-react'
import { getApiError } from '../../../services/api'
import { useCategories, useCreateCategory, useDeleteCategory, useUpdateCategory } from '../../../hooks/useCategories'
import { ConfirmDialog } from '../../../components/admin/ConfirmDialogue'

export function AdminCategoriesPage() {
  const { data: categories = [], isLoading, isError, refetch } = useCategories()
  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const deleteCategory = useDeleteCategory()
  const [name, setName] = useState('')
  const [editing, setEditing] = useState(null)
  const [categoryToDelete, setCategoryToDelete] = useState(null)
  const [error, setError] = useState('')

  const handleCreate = async (event) => {
    event.preventDefault()
    const nextName = name.trim()
    if (!nextName) return setError('Enter a category name.')

    setError('')
    try {
      await createCategory.mutateAsync({ name: nextName })
      setName('')
    } catch (requestError) {
      setError(getApiError(requestError, 'Could not create the category.'))
    }
  }

  const handleUpdate = async () => {
    const nextName = editing?.name?.trim()
    if (!nextName) return setError('Enter a category name.')

    setError('')
    try {
      await updateCategory.mutateAsync({ id: editing.id, name: nextName })
      setEditing(null)
    } catch (requestError) {
      setError(getApiError(requestError, 'Could not update the category.'))
    }
  }

  const handleDelete = async () => {
    if (!categoryToDelete) return
    setError('')
    try {
      await deleteCategory.mutateAsync(categoryToDelete.id)
      setCategoryToDelete(null)
    } catch (requestError) {
      setCategoryToDelete(null)
      setError(getApiError(requestError, 'Could not delete the category. It may still contain products.'))
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-normal text-[#111827] sm:text-3xl">Categories</h1>
        <p className="mt-1 text-sm text-[#6B7280]">Create and organize the categories shown in your shop.</p>
      </div>

      {error && <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

      <form onSubmit={handleCreate} className="mb-6 flex flex-col gap-3 rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:flex-row">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Category name, e.g. Ankara Fabrics"
          className="min-w-0 flex-1 rounded-full border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none focus:border-[#E67E22]/60"
        />
        <button disabled={createCategory.isPending} className="flex items-center justify-center gap-2 rounded-full bg-[#E67E22] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
          <Plus size={16} /> {createCategory.isPending ? 'Creating...' : 'Add Category'}
        </button>
      </form>

      {isLoading && <div className="rounded-2xl border border-[#E5E7EB] bg-white p-10 text-center text-sm text-[#6B7280]">Loading categories...</div>}
      {isError && <div className="rounded-2xl border border-red-100 bg-red-50 p-10 text-center"><p className="mb-3 text-sm text-red-600">Could not load categories.</p><button onClick={refetch} className="text-sm font-semibold text-[#E67E22] underline">Try again</button></div>}

      {!isLoading && !isError && (
        <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white">
          {categories.length === 0 ? (
            <p className="p-10 text-center text-sm text-[#6B7280]">No categories yet.</p>
          ) : categories.map((category) => {
            const isEditing = editing?.id === category.id
            return (
              <div key={category.id} className="flex items-center gap-3 border-b border-[#E5E7EB] px-5 py-4 last:border-0">
                <div className="min-w-0 flex-1">
                  {isEditing ? (
                    <input autoFocus value={editing.name} onChange={(event) => setEditing({ ...editing, name: event.target.value })} onKeyDown={(event) => event.key === 'Enter' && handleUpdate()} className="w-full max-w-sm rounded-lg border border-[#E67E22]/50 px-3 py-2 text-sm outline-none" />
                  ) : (
                    <><p className="font-medium text-[#111827]">{category.label}</p><p className="text-xs text-[#6B7280]">{category.slug}</p></>
                  )}
                </div>
                {isEditing ? (
                  <><button onClick={handleUpdate} disabled={updateCategory.isPending} aria-label="Save category" className="grid size-9 place-items-center rounded-lg text-green-600 hover:bg-green-50"><Check size={16} /></button><button onClick={() => setEditing(null)} aria-label="Cancel editing" className="grid size-9 place-items-center rounded-lg text-[#6B7280] hover:bg-stone-100"><X size={16} /></button></>
                ) : (
                  <><button onClick={() => setEditing({ id: category.id, name: category.label })} aria-label={`Edit ${category.label}`} className="grid size-9 place-items-center rounded-lg text-[#6B7280] hover:bg-stone-100"><Pencil size={15} /></button><button onClick={() => setCategoryToDelete(category)} aria-label={`Delete ${category.label}`} className="grid size-9 place-items-center rounded-lg text-red-500 hover:bg-red-50"><Trash2 size={15} /></button></>
                )}
              </div>
            )
          })}
        </div>
      )}

      <ConfirmDialog open={!!categoryToDelete} title="Delete category?" description={`Delete “${categoryToDelete?.label}”? Products assigned to it may need another category.`} confirmLabel="Delete" loading={deleteCategory.isPending} onConfirm={handleDelete} onCancel={() => setCategoryToDelete(null)} />
    </div>
  )
}

export default AdminCategoriesPage
