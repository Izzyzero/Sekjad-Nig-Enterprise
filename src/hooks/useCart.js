import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import { useRequireAuth } from './useRequireAuth'
import { cartService } from '../services/cart.service'
import { isVariantAvailable } from '../services/product.service'

export function useCart() {
  const queryClient = useQueryClient()
  const requireAuth = useRequireAuth()
  const { user, isAuthenticated, isAuthLoading } = useAuth()
  const queryKey = ['cart', user?.id ?? user?._id ?? 'current-user']

  const cartQuery = useQuery({
    queryKey,
    queryFn: cartService.get,
    enabled: isAuthenticated && !isAuthLoading,
  })

  const updateCachedCart = (cart) => queryClient.setQueryData(queryKey, cart)

  const addMutation = useMutation({
    mutationFn: cartService.addItem,
    onSuccess: updateCachedCart,
  })
  const updateMutation = useMutation({
    mutationFn: ({ cartItemId, quantity }) => cartService.updateItemQuantity(cartItemId, quantity),
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

  const addVariables = (product, quantity, variantId) => {
    const productId = product?.id ?? product?._id
    if (!productId || !requireAuth(`/shop/product/${encodeURIComponent(productId)}`)) return null
    if (product?.variants?.length && !isVariantAvailable(product.variants.find((variant) => variant.variantId === variantId))) return null
    return { productId, variantId, quantity }
  }

  const addToCart = (product, quantity = 1, variantId) => {
    const variables = addVariables(product, quantity, variantId)
    if (!variables) return false
    addMutation.mutate(variables)
    return true
  }
  const addToCartAsync = (product, quantity = 1, variantId) => {
    const variables = addVariables(product, quantity, variantId)
    if (!variables) return Promise.resolve(false)
    return addMutation.mutateAsync(variables)
  }

  const updateQuantity = (cartItemId, quantity) =>
    requireAuth('/cart') && updateMutation.mutate({ cartItemId, quantity })
  const removeFromCart = (cartItemId) => requireAuth('/cart') && removeMutation.mutate(cartItemId)
  const clearCart = () => requireAuth('/cart') && clearMutation.mutate()

  return {
    cart: cartQuery.data,
    items: cartQuery.data?.items ?? [],
    addToCart,
    addToCartAsync,
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
