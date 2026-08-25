import { Link } from 'react-router-dom'
import { Pencil, Trash2, ImageOff } from 'lucide-react'
import { useCategories } from '../../hooks/useCategories'

function formatNaira(value) {
  return `₦${Number(value).toLocaleString('en-NG')}`
}

export function AdminProductTable({ products, onDelete }) {
  const { data: categories = [] } = useCategories()
  const categoryNames = new Map(categories.map((category) => [category.id, category.label]))

  return (
    <div className="overflow-x-auto rounded-2xl border border-[#E5E7EB] bg-white">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-[#E5E7EB] text-[#6B7280]">
            <th className="px-5 py-3.5 font-medium">Product</th>
            <th className="px-5 py-3.5 font-medium">Category</th>
            <th className="px-5 py-3.5 font-medium">Price</th>
            <th className="px-5 py-3.5 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b border-[#E5E7EB] last:border-none">
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-stone-100">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                    ) : (
                      <ImageOff size={16} className="text-[#6B7280]" />
                    )}
                  </div>
                  <span className="text-[#111827] font-medium">{product.name}</span>
                </div>
              </td>
              <td className="text-[#6B7280] px-5 py-3.5">
                {product.categoryLabel || categoryNames.get(product.category) || 'Uncategorized'}
              </td>
              <td className="px-5 py-3.5">
                <span className="text-[#111827] font-medium">{formatNaira(product.price)}</span>
                {product.compareAtPrice && (
                  <span className="text-[#6B7280] ml-2 text-xs line-through">{formatNaira(product.compareAtPrice)}</span>
                )}
              </td>
              <td className="px-5 py-3.5">
                <div className="flex justify-end gap-1.5">
                  <Link
                    to={`/admin/products/${product.id}/edit`}
                    aria-label={`Edit ${product.name}`}
                    className="text-[#6B7280] hover:bg-stone-100 hover:text-[#111827] flex size-9 items-center justify-center rounded-lg"
                  >
                    <Pencil size={15} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => onDelete(product)}
                    aria-label={`Delete ${product.name}`}
                    className="flex size-9 items-center justify-center rounded-lg text-red-500 hover:bg-red-50"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AdminProductTable
