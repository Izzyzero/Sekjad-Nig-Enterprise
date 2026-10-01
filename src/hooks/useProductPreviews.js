import { useQuery } from '@tanstack/react-query'
import { productPreviewService } from '../services/product-preview.service'

export function useProductPreviews(section) {
  return useQuery({
    queryKey: ['product-preview', section],
    queryFn: productPreviewService[section],
    staleTime: 60000,
    retry: false,
    refetchOnWindowFocus: false,
  })
}
