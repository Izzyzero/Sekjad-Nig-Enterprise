import { useQuery } from '@tanstack/react-query'
import { getDashboardStats } from '../services/dashboard.service'

export function useDashboardStats(range = '30d') {
  return useQuery({
    queryKey: ['admin-dashboard', range],
    queryFn: () => getDashboardStats({ range }),
    staleTime: 60 * 1000,
  })
}