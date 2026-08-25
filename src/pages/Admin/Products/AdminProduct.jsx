import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search } from 'lucide-react'
import { useAdminProducts, useDeleteProduct } from '../../../hooks/useProducts'
import { useDebounce } from '../../../hooks/useDebounce'
import { AdminProductTable } from '../../../components/admin/AdminProductTable'
import { ConfirmDialog } from '../../../components/admin/ConfirmDialogue'
import { ProductPagination } from '../../../components/products/ProductPagination'
import { useCategories } from '../../../hooks/useCategories'

const PAGE_SIZE = 12

export function AdminProductsPage() {
  const { data: categories = [] } = useCategories()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [page, setPage] = useState(1)
  const [productToDelete, setProductToDelete] = useState(null)

  const debouncedSearch = useDebounce(search, 400)

  const { data, isLoading, isError, refetch } = useAdminProducts({
    page,
    limit: PAGE_SIZE,
    search: debouncedSearch,
    category,
  })
  const deleteMutation = useDeleteProduct()

  const products = data?.items ?? []
  const total = data?.total ?? 0
  const totalPages = Math.max(1, data?.totalPages ?? Math.ceil(total / PAGE_SIZE))

  const confirmDelete = async () => {
    if (!productToDelete) return
    await deleteMutation.mutateAsync(productToDelete.id)
    setProductToDelete(null)
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-[#111827] text-2xl font-normal sm:text-3xl">Products</h1>
          <p className="text-[#6B7280] mt-1 text-sm">{total} products in your catalog</p>
        </div>
        <Link
          to="/admin/products/new"
          className="flex items-center justify-center gap-2 rounded-full bg-[#E67E22] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#d4711f]"
        >
          <Plus size={16} /> Add Product
        </Link>
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-sm">
          <Search size={16} className="text-[#6B7280] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search products..."
            className="focus:border-[#E67E22]/60 w-full rounded-full border border-[#E5E7EB] bg-white py-2.5 pl-10 pr-4 text-sm text-[#111827] outline-none"
          />
        </div>

        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value); setPage(1) }}
          className="focus:border-[#E67E22]/60 rounded-full border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#111827] outline-none"
        >
          <option value="all">All Products</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
      </div>

      {isError && (
        <div className="rounded-2xl border border-red-100 bg-red-50/50 px-8 py-16 text-center">
          <p className="text-[#111827] mb-2 font-medium">Couldn&apos;t load products.</p>
          <button type="button" onClick={refetch} className="text-[#E67E22] text-sm font-semibold underline">
            Try Again
          </button>
        </div>
      )}

      {!isError && isLoading && (
        <div className="rounded-2xl border border-[#E5E7EB] bg-white px-8 py-16 text-center text-sm text-[#6B7280]">
          Loading products…
        </div>
      )}

      {!isError && !isLoading && products.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[#E5E7EB] px-8 py-16 text-center">
          <p className="text-[#111827] mb-1 font-medium">No products yet</p>
          <p className="text-[#6B7280] mb-5 text-sm">Add your first product to get started.</p>
          <Link to="/admin/products/new" className="rounded-full bg-[#E67E22] px-5 py-2.5 text-sm font-semibold text-white">
            Add Product
          </Link>
        </div>
      )}

      {!isError && !isLoading && products.length > 0 && (
        <>
          <AdminProductTable products={products} onDelete={setProductToDelete} />
          <ProductPagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      <ConfirmDialog
        open={!!productToDelete}
        title="Delete product?"
        description={`"${productToDelete?.name}" will be permanently removed from your catalog. This can't be undone.`}
        confirmLabel="Delete"
        loading={deleteMutation.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setProductToDelete(null)}
      />
    </div>
  )
}

export default AdminProductsPage
