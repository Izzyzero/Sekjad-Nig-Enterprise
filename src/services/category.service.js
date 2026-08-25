import { api } from './api'

export const categoryService = {
  list: async () => {
    const { data } = await api.get('/categories')
    const categories = data?.data ?? data ?? []

    return (Array.isArray(categories) ? categories : []).map((category) => ({
      ...category,
      id: category.id ?? category._id,
      label: category.label ?? category.name,
    }))
  },
  create: async (details) => {
    const { data } = await api.post('/categories', details)
    return data?.data ?? data
  },
  update: async (id, details) => {
    const { data } = await api.patch(`/categories/${id}`, details)
    return data?.data ?? data
  },
  remove: async (id) => {
    const { data } = await api.delete(`/categories/${id}`)
    return data
  },
}
