import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useAdminProduct, useCreateProduct, useUpdateProduct } from '../../../hooks/useProducts'
import { AdminProductFormFields } from '../../../components/admin/AdminProductFormFields'

const productSchema = z
  .object({
    title: z.string().trim().min(2, 'Enter a product title').max(150),
    category: z.string().min(1, 'Select a category'),
    price: z.coerce.number().nonnegative('Price cannot be negative'),
    compareAtPrice: z.preprocess(
      (value) => value === '' || value === null ? undefined : value,
      z.coerce.number().nonnegative().optional(),
    ),
    description: z.string().trim().min(1, 'Enter a description').max(5000),
    brand: z.string().trim().max(100).optional(),
    sku: z.string().trim().optional(),
    tags: z.string().optional(),
    status: z.enum(['draft', 'active', 'archived']),
    isFeatured: z.boolean(),
    imageAltText: z.string().trim().max(150).optional(),
  })
  .refine((data) => !data.compareAtPrice || data.compareAtPrice >= data.price, {
    message: 'Compare-at price must be greater than or equal to the selling price',
    path: ['compareAtPrice'],
  })

export function AdminProductFormPage() {
  const { id } = useParams()
  const isEditMode = !!id
  const navigate = useNavigate()

  const { data: existingProduct, isLoading: isLoadingProduct } = useAdminProduct(id)
  const createMutation = useCreateProduct()
  const updateMutation = useUpdateProduct()

  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [galleryFiles, setGalleryFiles] = useState([])
  const [galleryPreviews, setGalleryPreviews] = useState([])
  const [submitError, setSubmitError] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: '',
      category: '',
      price: '',
      compareAtPrice: '',
      description: '',
      brand: '',
      sku: '',
      tags: '',
      status: 'active',
      isFeatured: false,
      imageAltText: '',
    },
  })

  useEffect(() => {
    if (existingProduct) {
      reset({
        title: existingProduct.name,
        category: existingProduct.category,
        price: existingProduct.price,
        compareAtPrice: existingProduct.compareAtPrice ?? '',
        description: existingProduct.description ?? '',
        brand: existingProduct.brand ?? '',
        sku: existingProduct.sku ?? '',
        tags: (existingProduct.tags ?? []).join(', '),
        status: existingProduct.status ?? 'active',
        isFeatured: existingProduct.isFeatured ?? false,
        imageAltText: existingProduct.imageAlt ?? '',
      })
      setImagePreview(existingProduct.image ?? null)
      setGalleryPreviews(existingProduct.gallery ?? [])
    }
  }, [existingProduct, reset])

  const handleImageChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleGalleryChange = (event) => {
    const availableSlots = Math.max(0, 10 - galleryPreviews.length)
    const files = Array.from(event.target.files ?? []).slice(0, availableSlots)

    if (files.length > 0) {
      setGalleryFiles((currentFiles) => [...currentFiles, ...files])
      setGalleryPreviews((currentPreviews) => [
        ...currentPreviews,
        ...files.map((file) => URL.createObjectURL(file)),
      ])
    }

    // Allow another selection (including selecting the same file again).
    event.target.value = ''
  }

  const onSubmit = async (formValues) => {
    setSubmitError('')
    try {
      if (!isEditMode && !imageFile) {
        setSubmitError('Select a product image.')
        return
      }
      const payload = { ...formValues, image: imageFile, gallery: galleryFiles }

      if (isEditMode) {
        await updateMutation.mutateAsync({ id, payload })
      } else {
        await createMutation.mutateAsync(payload)
      }
      navigate('/admin/products')
    } catch (error) {
      setSubmitError('Something went wrong saving this product. Please try again.')
    }
  }

  if (isEditMode && isLoadingProduct) {
    return <p className="text-[#6B7280] text-sm">Loading product…</p>
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link to="/admin/products" className="text-[#6B7280] hover:text-[#111827] mb-6 inline-flex items-center gap-1.5 text-sm">
        <ArrowLeft size={15} /> Back to Products
      </Link>

      <h1 className="font-display text-[#111827] mb-6 text-2xl font-normal sm:text-3xl">
        {isEditMode ? 'Edit Product' : 'Add New Product'}
      </h1>

      {submitError && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-8">
        <AdminProductFormFields
          register={register}
          errors={errors}
          imagePreview={imagePreview}
          onImageChange={handleImageChange}
          galleryPreviews={galleryPreviews}
          onGalleryChange={handleGalleryChange}
        />

        <div className="mt-7 flex gap-3">
          <Link
            to="/admin/products"
            className="border-[#E5E7EB] text-[#111827] flex-1 rounded-full border py-3 text-center text-sm font-medium"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 rounded-full bg-[#E67E22] py-3 text-sm font-semibold text-white transition hover:bg-[#d4711f] disabled:opacity-60"
          >
            {isSubmitting ? 'Saving…' : isEditMode ? 'Save Changes' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminProductFormPage
