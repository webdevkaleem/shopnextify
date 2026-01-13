'use client'
import { Product, Variant } from '@/payload-types'
import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import { Clock, Info } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

type Props = {
  product: Product
}

export const StockIndicator: React.FC<Props> = ({ product }) => {
  const { cart } = useCart()
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

  const stockQuantity = useMemo(() => {
    // Get base inventory
    let baseInventory = 0
    if (product.enableVariants) {
      if (selectedVariant) {
        baseInventory = selectedVariant.inventory || 0
      }
    } else {
      baseInventory = product.inventory || 0
    }

    // Find matching cart item
    const existingItem = cart?.items?.find((item) => {
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

    // Subtract cart quantity from available stock
    const cartQuantity = existingItem?.quantity || 0
    return Math.max(0, baseInventory - cartQuantity)
  }, [product.enableVariants, selectedVariant, product.inventory, product.id, cart?.items])

  if (product.enableVariants && !selectedVariant) {
    return null
  }

  return (
    <div className="text-sm flex items-center gap-2">
      {stockQuantity < 10 && stockQuantity > 0 && (
        <>
          <Clock className="size-5" />
          <p>Only {stockQuantity} left in stock. Order soon!</p>
        </>
      )}
      {(stockQuantity === 0 || !stockQuantity) && (
        <>
          <Info className="size-5" />
          <p>Out of stock</p>
        </>
      )}
    </div>
  )
}
