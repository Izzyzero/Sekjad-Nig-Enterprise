
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getOrders, getOrder, updateOrderStatus } from '../services/order.service'

export function useAdminOrders(filters) {
  return useQuery({
    queryKey: ['admin-orders', filters],
    queryFn: () => getOrders(filters),
    keepPreviousData: true,
  })
}

export function useAdminOrder(id) {
  return useQuery({
    queryKey: ['admin-order', id],
    queryFn: () => getOrder(id),
    enabled: !!id,
  })
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }) => updateOrderStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
      queryClient.invalidateQueries({ queryKey: ['admin-order', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] })
    },
  })
}