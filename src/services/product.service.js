// import { api } from './api'
// export const productService = { list: () => api('/products'), get: (id) => api(`/products/${id}`) }
// import axios from 'axios'

// Adjust baseURL to match your existing axios instance/config if you already
// have one (e.g. src/lib/api.js or src/config/axios.js). This is a standalone
// instance so the file works even before that's wired up.
// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
// })

import { api } from './api'

const getCategoryLabel = (categories) => {
  const category = categories?.[0]
  if (!category) return ''
  if (typeof category === 'object') return category.name ?? ''
  return ''
}

const normalizeProduct = (product = {}) => ({
  ...product,
  id: product.id ?? product._id,
  name: product.name ?? product.title ?? '',
  image: typeof product.image === 'string' ? product.image : product.image?.url ?? '',
  imageAlt: product.image?.altText ?? product.title ?? product.name ?? '',
  categoryLabel: product.categoryLabel ?? getCategoryLabel(product.categories),
  category: product.category ?? product.categories?.[0]?._id ?? product.categories?.[0] ?? '',
  compareAtPrice: product.compareAtPrice ?? null,
  colors: product.colors ?? [],
  gallery: (product.gallery ?? []).map((image) => typeof image === 'string' ? image : image?.url).filter(Boolean),
})

const normalizeProductList = (response = {}) => {
  const items = response.items ?? response.data ?? []
  const pagination = response.pagination ?? {}

  return {
    items: Array.isArray(items) ? items.map(normalizeProduct) : [],
    total: response.total ?? pagination.total ?? 0,
    page: response.page ?? pagination.page ?? 1,
    totalPages: response.totalPages ?? pagination.pages ?? 1,
  }
}

const toProductFormData = (product = {}) => {
  const formData = new FormData()
  const fields = {
    title: product.title,
    description: product.description,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    currency: product.currency ?? 'NGN',
    brand: product.brand,
    sku: product.sku,
    status: product.status ?? 'active',
    isFeatured: product.isFeatured ?? false,
    imageAltText: product.imageAltText,
  }

  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') formData.append(key, String(value))
  })
  const categories = product.categories ?? (product.category ? [product.category] : [])
  categories.forEach((category) => formData.append('categories[]', category))
  const tags = String(product.tags ?? '').split(',').map((tag) => tag.trim()).filter(Boolean)
  tags.forEach((tag) => formData.append('tags[]', tag))
  if (product.image) formData.append('image', product.image)
  ;(product.gallery ?? []).forEach((image) => formData.append('gallery', image))
  return formData
}


/**
 * Fetch a paginated, filtered list of products.
 * Params map 1:1 onto GET /api/products query string.
 */
export async function getProducts(params = {}) {
  const {
    page = 1,
    limit = 12,
    search,
    category,
    minPrice,
    maxPrice,
    isFeatured,
    sort,
  } = params

  const { data } = await api.get('/products', {
    params: {
      page,
      limit,
      search: search || undefined,
      category: category && category !== 'all' ? category : undefined,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
      isFeatured: typeof isFeatured === 'boolean' ? isFeatured : undefined,
      sort: sort || undefined,
    },
  })
  return normalizeProductList(data)
}

export async function getProduct(id) {
  const { data } = await api.get(`/products/${id}`)
  return normalizeProduct(data?.data ?? data)
}

/**
 * Lightweight search-suggestions endpoint for the search dropdown
 * (product name matches + category matches). Falls back gracefully
 * if the backend doesn't have this endpoint yet — see useProductSuggestions.
 */
export async function searchSuggestions(query) {
  const { data } = await api.get('/products/suggestions', { params: { q: query } })
  const response = data?.data ?? data
  return {
    products: (response?.products ?? []).map(normalizeProduct),
    categories: response?.categories ?? [],
  }
}



// ── Admin CRUD ──
// Adjust endpoints if your backend nests admin routes differently
// (e.g. /api/admin/products vs a role-gated /api/products).

export async function createProduct(payload) {
  const { data } = await api.post('/upload/product/', toProductFormData(payload))
  return data
}

export async function updateProduct(id, payload) {
  const { data } = await api.patch(`/products/${id}`, toProductFormData(payload))
  return data
}

export async function deleteProduct(id) {
  const { data } = await api.delete(`/products/${id}`)
  return data
}

// Separate from public getProducts() in case admin listing needs
// different fields (e.g. drafts, stock count) — falls back to the
// same endpoint if your backend doesn't distinguish.
export async function getAdminProducts(params = {}) {
  const { page = 1, limit = 12, search, category, sort } = params
  const { data } = await api.get('/products', {
    params: {
      page,
      limit,
      search: search || undefined,
      category: category && category !== 'all' ? category : undefined,
      sort: sort || undefined,
    },
  })
  return normalizeProductList(data)
}

export default {
  getProducts,
  getProduct,
  searchSuggestions,
  createProduct,
  updateProduct,
  deleteProduct,
  getAdminProducts,
}

// export default { getProducts, getProduct, searchSuggestns }
