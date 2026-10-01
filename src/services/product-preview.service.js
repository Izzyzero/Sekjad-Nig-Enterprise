import axios from 'axios'

// Public previews never attach session credentials or use auth-refresh interceptors.
export const previewApi = axios.create({ baseURL: import.meta.env?.VITE_API_URL, timeout: 15000 })

const loadPreview = async (section) => {
  const { data } = await previewApi.get(`/products/preview/${section}`)
  if (!data?.success || !Array.isArray(data.data)) throw new Error('Unable to load products.')
  return data.data.map((product) => ({
    ...product,
    id: product._id,
    name: product.title,
    image: product.image?.url ?? '',
    imageAlt: product.image?.altText || product.title,
  }))
}

export const productPreviewService = {
  featured: () => loadPreview('featured'),
  latest: () => loadPreview('latest'),
}
