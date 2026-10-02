import { useCategories } from '../../hooks/useCategories'

function FieldError({ message }) {
  return message ? <p className="mt-1.5 text-xs text-red-500">{message}</p> : null
}

const inputClass = (hasError) =>
  `w-full rounded-lg border bg-white px-4 py-3 text-sm text-[#111827] outline-none transition-colors focus:border-[#E67E22]/60 ${
    hasError ? 'border-red-400' : 'border-[#E5E7EB]'
  }`

export function AdminProductFormFields({
  register,
  errors,
  imagePreview,
  onImageChange,
  galleryPreviews,
  onGalleryChange,
  variants = [],
  onVariantsChange,
}) {
  const { data: categories = [], isLoading: categoriesLoading } = useCategories()

  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#111827]">Product Title</label>
          <input className={inputClass(errors.title)} placeholder="e.g. Royal Gold Aso Oke" {...register('title')} />
          <FieldError message={errors.title?.message} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#111827]">Category</label>
          <select disabled={categoriesLoading} className={inputClass(errors.category)} {...register('category')}>
            <option value="">{categoriesLoading ? 'Loading categories...' : 'Select a category'}</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.label}</option>)}
          </select>
          <FieldError message={errors.category?.message} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#111827]">Selling Price (₦)</label>
          <input type="number" min="0" max="99999999.99" step="0.01" className={inputClass(errors.price)} placeholder="85000" {...register('price')} />
          <FieldError message={errors.price?.message} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#111827]">Compare-at Price <span className="font-normal text-[#6B7280]">(optional)</span></label>
          <input type="number" min="0" max="99999999.99" step="0.01" className={inputClass(errors.compareAtPrice)} placeholder="95000" {...register('compareAtPrice')} />
          <FieldError message={errors.compareAtPrice?.message} />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-[#111827]">Description</label>
        <textarea rows={4} className={`${inputClass(errors.description)} resize-none`} placeholder="Describe the fabric..." {...register('description')} />
        <FieldError message={errors.description?.message} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div><label className="mb-1.5 block text-sm font-medium text-[#111827]">Brand <span className="font-normal text-[#6B7280]">(optional)</span></label><input className={inputClass(errors.brand)} placeholder="Sekjad" {...register('brand')} /><FieldError message={errors.brand?.message} /></div>
        <div><label className="mb-1.5 block text-sm font-medium text-[#111827]">SKU <span className="font-normal text-[#6B7280]">(optional)</span></label><input className={inputClass(errors.sku)} placeholder="LACE-001" {...register('sku')} /><FieldError message={errors.sku?.message} /></div>
      </div>

      <div><label className="mb-1.5 block text-sm font-medium text-[#111827]">Status</label><select className={inputClass(errors.status)} {...register('status')}><option value="active">Active</option><option value="draft">Draft</option><option value="archived">Archived</option></select></div>

      <div><label className="mb-1.5 block text-sm font-medium text-[#111827]">Tags <span className="font-normal text-[#6B7280]">(comma separated)</span></label><input className={inputClass(errors.tags)} placeholder="lace, wedding, swiss" {...register('tags')} /></div>
      <label className="flex items-center gap-2.5 text-sm font-medium text-[#111827]"><input type="checkbox" className="size-4 accent-[#E67E22]" {...register('isFeatured')} />Featured product</label>

      <div>
        <label className="mb-2 block text-sm font-medium text-[#111827]">Product Image</label>
        <div className="flex min-w-0 flex-wrap items-center gap-4">
          <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#E5E7EB] bg-stone-50">
            {imagePreview ? <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" /> : <span className="text-xs text-[#6B7280]">No image</span>}
          </div>
          <input type="file" accept="image/jpeg,image/png,image/gif" onChange={onImageChange} className="max-w-full min-w-0 text-sm text-[#6B7280] file:mr-3 file:rounded-full file:border-0 file:bg-[#E67E22]/10 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-[#E67E22]" />
        </div>
        <input className={`${inputClass(errors.imageAltText)} mt-3`} placeholder="Image alt text (optional)" {...register('imageAltText')} />
        <FieldError message={errors.imageAltText?.message} />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-[#111827]">Gallery Images <span className="font-normal text-[#6B7280]">(optional, up to 10)</span></label>
        <p className="mb-3 text-xs text-[#6B7280]">These images appear only on the product details page.</p>
        <input type="file" multiple accept="image/jpeg,image/png,image/gif" onChange={onGalleryChange} className="max-w-full min-w-0 text-sm text-[#6B7280] file:mr-3 file:rounded-full file:border-0 file:bg-[#E67E22]/10 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-[#E67E22]" />
        {galleryPreviews?.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
            {galleryPreviews.map((image, index) => <div key={image} className="aspect-square overflow-hidden rounded-xl border border-[#E5E7EB] bg-stone-50"><img src={image} alt={`Gallery preview ${index + 1}`} className="h-full w-full object-cover" /></div>)}
          </div>
        )}
      </div>

      <section aria-labelledby="product-variants-heading">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 id="product-variants-heading" className="text-sm font-medium text-[#111827]">Color Variants</h2>
            <p className="mt-1 text-xs text-[#6B7280]">Add each selectable color and its image. Gallery images are managed separately.</p>
          </div>
          <button
            type="button"
            onClick={() => onVariantsChange((current) => [...current, { colorName: '', image: { url: '', altText: '' }, isAvailable: true }])}
            className="rounded-full border border-[#E5E7EB] px-4 py-2 text-xs font-semibold text-[#111827] hover:border-[#E67E22]"
          >
            Add color
          </button>
        </div>
        <div className="space-y-4">
          {variants.map((variant, index) => (
            <fieldset key={variant.variantId ?? `new-${index}`} className="grid gap-3 rounded-xl border border-[#E5E7EB] p-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)_auto]">
              <legend className="sr-only">Color variant {index + 1}</legend>
              <div>
                <label htmlFor={`variant-color-${index}`} className="mb-1.5 block text-xs font-medium text-[#111827]">Color name</label>
                <input
                  id={`variant-color-${index}`}
                  value={variant.colorName ?? ''}
                  onChange={(event) => onVariantsChange((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, colorName: event.target.value } : item))}
                  className={inputClass(false)}
                  placeholder="e.g. Burgundy"
                />
              </div>
              <div>
                <label htmlFor={`variant-image-${index}`} className="mb-1.5 block text-xs font-medium text-[#111827]">Color image URL</label>
                <input
                  id={`variant-image-${index}`}
                  value={variant.image?.url ?? ''}
                  onChange={(event) => onVariantsChange((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, image: { ...item.image, url: event.target.value } } : item))}
                  className={inputClass(false)}
                  placeholder="https://..."
                  type="url"
                />
                {variant.image?.url && <img src={variant.image.url} alt={variant.image.altText || variant.colorName || 'Variant preview'} className="mt-2 size-14 rounded-lg object-cover" />}
              </div>
              <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-start sm:justify-center">
                <label className="flex items-center gap-2 text-xs text-[#111827]">
                  <input
                    type="checkbox"
                    checked={variant.isAvailable !== false}
                    onChange={(event) => onVariantsChange((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, isAvailable: event.target.checked } : item))}
                    className="size-4 accent-[#E67E22]"
                  />
                  Available
                </label>
                <button
                  type="button"
                  onClick={() => onVariantsChange((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                  className="text-xs font-medium text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            </fieldset>
          ))}
          {variants.length === 0 && <p className="rounded-xl bg-stone-50 px-4 py-3 text-xs text-[#6B7280]">No color variants. Customers can add this product directly to their cart.</p>}
        </div>
      </section>
    </div>
  )
}

export default AdminProductFormFields
