'use client'

import { Button, ButtonProps } from '@/components/ui/button'
import type { Product, Variant } from '@/payload-types'

import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import { MinusIcon, Plus, PlusIcon } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import React, { useCallback, useMemo } from 'react'
import { toast } from 'sonner'
type Props = {
  product: Product
  showQuantity?: boolean
  buttonVariant?: ButtonProps['variant']
}

export function AddToCart({ product, showQuantity = true, buttonVariant = 'outline' }: Props) {
  const { addItem, decrementItem, cart, isLoading } = useCart()
  const searchParams = useSearchParams()

  const variants = product.variants?.docs || []

  const selectedVariant = useMemo<Variant | undefined>(() => {
    if (product.enableVariants && variants.length) {
      const variantId = searchParams.get('variant')

      const validVariant = variants.find((variant) => {
        if (typeof variant === 'object') {
          return String(variant.id) === variantId
        }
        return String(variant) === variantId
      })

      if (validVariant && typeof validVariant === 'object') {
        return validVariant
      }
    }

    return undefined
  }, [product.enableVariants, searchParams, variants])

  const addToCart = useCallback(
    (e: React.FormEvent<HTMLButtonElement>) => {
      e.preventDefault()

      addItem({
        product: product.id,
        variant: selectedVariant?.id ?? undefined,
      }).then(() => {
        toast.success('Item added to cart.')
      })
    },
    [addItem, product, selectedVariant],
  )

  const existingItem = useMemo(() => {
    return cart?.items?.find((item) => {
      const productID = typeof item.product === 'object' ? item.product?.id : item.product
      const variantID = item.variant
        ? typeof item.variant === 'object'
          ? item.variant?.id
          : item.variant
        : undefined

      if (productID === product.id) {
        if (product.enableVariants) {
          return variantID === selectedVariant?.id
        }
        return true
      }
      return false
    })
  }, [cart?.items, product.id, product.enableVariants, selectedVariant?.id])

  const cartQuantity = useMemo(() => {
    return existingItem?.quantity || 0
  }, [existingItem?.quantity])

  const removeFromCart = useCallback(
    async (e: React.FormEvent<HTMLButtonElement>) => {
      e.preventDefault()

      if (!existingItem?.id) return

      try {
        await decrementItem(existingItem.id)
        // Compute toast message based on quantity after decrement
        const newQuantity = existingItem.quantity - 1
        toast.success(newQuantity === 0 ? 'Item removed from cart.' : 'Quantity decreased.')
      } catch (error) {
        toast.error('Failed to update cart. Please try again.')
      }
    },
    [decrementItem, existingItem?.id, existingItem?.quantity],
  )

  // Disabled state for increment button (plus) - when out of stock or all items added
  const incrementDisabled = useMemo<boolean>(() => {
    if (existingItem) {
      const existingQuantity = existingItem.quantity

      if (product.enableVariants) {
        return existingQuantity >= (selectedVariant?.inventory || 0)
      }
      return existingQuantity >= (product.inventory || 0)
    }

    if (product.enableVariants) {
      if (!selectedVariant) {
        return true
      }

      if (selectedVariant.inventory === 0) {
        return true
      }
    } else {
      if (product.inventory === 0) {
        return true
      }
    }

    return false
  }, [selectedVariant, existingItem, product])

  // Disabled state for decrement button (minus) - when quantity is 0 or no item in cart
  // Note: If product is out of stock but we have items in cart, we can still remove them
  const decrementDisabled = useMemo<boolean>(() => {
    return cartQuantity === 0 || !existingItem || isLoading
  }, [cartQuantity, existingItem, isLoading])

  return (
    <div className="flex items-center gap-4 w-full">
      {/* Amount */}
      {showQuantity && (
        <div className="flex items-center gap-2 border rounded-full py-2 px-4 shrink-0">
          <Button
            variant={'ghost'}
            size={'icon'}
            disabled={decrementDisabled}
            onClick={removeFromCart}
            type="button"
            aria-label="Remove from cart"
          >
            <MinusIcon className="size-4" />
          </Button>
          <span className="text-sm select-none">{cartQuantity}</span>
          <Button
            variant={'ghost'}
            size={'icon'}
            disabled={incrementDisabled || isLoading}
            onClick={addToCart}
            type="button"
            aria-label="Add to cart"
          >
            <PlusIcon className="size-4" />
          </Button>
        </div>
      )}

      <Button
        aria-label="Add to cart"
        variant={buttonVariant || 'outline'}
        className="flex-1"
        disabled={incrementDisabled || isLoading}
        onClick={addToCart}
        type="button"
      >
        <span className="hidden sm:block">Add To Cart</span>
        <Plus className="sm:hidden size-6" />
      </Button>
    </div>
  )
}
