import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import { wishlistService } from '../services/wishlist.service'

export function useWishlist() {
  const queryClient = useQueryClient()
  const { user, isAuthenticated, isAuthLoading } = useAuth()
  const queryKey = ['wishlist', user?.id ?? user?._id ?? 'current-user']

  const wishlistQuery = useQuery({
    queryKey,
    queryFn: wishlistService.get,
    enabled: isAuthenticated && !isAuthLoading,
  })

  const updateCachedWishlist = (wishlist) => queryClient.setQueryData(queryKey, wishlist)
  const addMutation = useMutation({
    mutationFn: wishlistService.addProduct,
    onSuccess: updateCachedWishlist,
  })
  const removeMutation = useMutation({
    mutationFn: wishlistService.removeProduct,
    onSuccess: updateCachedWishlist,
  })
  const clearMutation = useMutation({
    mutationFn: wishlistService.clear,
    onSuccess: updateCachedWishlist,
  })

  const items = wishlistQuery.data?.items ?? []
  const isWishlisted = (productId) =>
    items.some((item) => String(item.id) === String(productId))

  const add = (productOrId) => {
    const productId = productOrId?.id ?? productOrId?._id ?? productOrId
    if (productId) addMutation.mutate(productId)
  }
  const remove = (productOrId) => {
    const productId = productOrId?.id ?? productOrId?._id ?? productOrId
    if (productId) removeMutation.mutate(productId)
  }
  const toggle = (product) => {
    const productId = product?.id ?? product?._id
    if (!productId) return
    if (isWishlisted(productId)) removeMutation.mutate(productId)
    else addMutation.mutate(productId)
  }

  return {
    wishlist: wishlistQuery.data,
    items,
    isWishlisted,
    add,
    remove,
    toggle,
    clear: () => clearMutation.mutate(),
    isLoading: isAuthLoading || wishlistQuery.isLoading,
    isError: wishlistQuery.isError,
    error: wishlistQuery.error,
    mutationError: addMutation.error ?? removeMutation.error ?? clearMutation.error,
    isUpdating: addMutation.isPending || removeMutation.isPending || clearMutation.isPending,
    refetch: wishlistQuery.refetch,
  }
}
