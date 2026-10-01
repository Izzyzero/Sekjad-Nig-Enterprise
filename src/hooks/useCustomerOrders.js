import { useQuery } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import { customerOrdersService } from '../services/customer-orders.service'

export function useCustomerOrders(page = 1) {
  const { user, isAuthenticated, isAuthLoading } = useAuth()
  return useQuery({
    queryKey: ['customer-orders', user?.id ?? user?._id ?? 'current-user', page],
    queryFn: () => customerOrdersService.list(page),
    enabled: isAuthenticated && !isAuthLoading,
  })
}
