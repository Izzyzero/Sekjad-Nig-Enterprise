// export function useProducts() {
//   return { products: [], loading: false, error: null }
// }
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getProducts,
  searchSuggestions,
  getAdminProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../services/product.service'

export function useProducts(filters, options = {}) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => getProducts(filters),
    keepPreviousData: true, // avoids grid flashing empty between pages/filters
    staleTime: 60 * 1000,
    ...options,
  })
}

export function useProductSuggestions(query) {
  return useQuery({
    queryKey: ['product-suggestions', query],
    queryFn: () => searchSuggestions(query),
    enabled: query.trim().length > 1,
    staleTime: 30 * 1000,
    retry: false,
  })
}
export function useAdminProducts(filters) {
  return useQuery({
    queryKey: ['admin-products', filters],
    queryFn: () => getAdminProducts(filters),
    keepPreviousData: true,
  })
}

export function useAdminProduct(id) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id),
    enabled: !!id,
  })
}

export function useProduct(id) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id),
    enabled: !!id,
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }) => updateProduct(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['product', variables.id] })
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}
