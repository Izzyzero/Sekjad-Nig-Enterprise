import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import { cartService } from '../services/cart.service'

export function useCart() {
  const queryClient = useQueryClient()
  const { user, isAuthenticated, isAuthLoading } = useAuth()
  const queryKey = ['cart', user?.id ?? user?._id ?? 'current-user']

  const cartQuery = useQuery({
    queryKey,
    queryFn: cartService.get,
    enabled: isAuthenticated && !isAuthLoading,
  })

  const updateCachedCart = (cart) => queryClient.setQueryData(queryKey, cart)

  const addMutation = useMutation({
    mutationFn: ({ productId, quantity }) => cartService.addItem(productId, quantity),
    onSuccess: updateCachedCart,
  })
  const updateMutation = useMutation({
    mutationFn: ({ productId, quantity }) => cartService.updateItemQuantity(productId, quantity),
    onSuccess: updateCachedCart,
  })
  const removeMutation = useMutation({
    mutationFn: cartService.removeItem,
    onSuccess: updateCachedCart,
  })
  const clearMutation = useMutation({
    mutationFn: cartService.clear,
    onSuccess: updateCachedCart,
  })

  const addToCart = (product, quantity = 1) => {
    const productId = product?.id ?? product?._id
    if (productId) addMutation.mutate({ productId, quantity })
  }

  const updateQuantity = (id, quantity) =>
    updateMutation.mutate({ productId: id, quantity })
  const removeFromCart = (id) => removeMutation.mutate(id)
  const clearCart = () => clearMutation.mutate()

  return {
    cart: cartQuery.data,
    items: cartQuery.data?.items ?? [],
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    isLoading: isAuthLoading || cartQuery.isLoading,
    isError: cartQuery.isError,
    error: cartQuery.error,
    mutationError:
      addMutation.error ??
      updateMutation.error ??
      removeMutation.error ??
      clearMutation.error,
    isUpdating:
      addMutation.isPending ||
      updateMutation.isPending ||
      removeMutation.isPending ||
      clearMutation.isPending,
    refetch: cartQuery.refetch,
  }
}
