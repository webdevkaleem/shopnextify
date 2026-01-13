'use client'
import type { Media, Product } from '@/payload-types'

import { Media as MediaComponent } from '@/components/Media'
import { Price } from '@/components/Price'
import { Button } from '@/components/ui/button'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { cartQueue } from '@/utilities/cartQueue'
import { cn } from '@/utilities/cn'
import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import { Info, Loader2, Plus } from 'lucide-react'
import * as motion from 'motion/react-client'
import Link from 'next/link'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { preload } from 'react-dom'
import { toast } from 'sonner'

type ProductCardProps = {
  product: Product
  index: number
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index }) => {
  const { addItem, cart, isLoading } = useCart()

  const firstImage =
    product.gallery?.[0]?.image && typeof product.gallery[0]?.image !== 'string'
      ? (product.gallery[0].image as Media)
      : null

  const secondImage =
    product.gallery?.[1]?.image && typeof product.gallery[1]?.image !== 'string'
      ? (product.gallery[1].image as Media)
      : null

  const [availableQuantity, setAvailableQuantity] = useState(product.inventory ?? 0)
  const [isAdding, setIsAdding] = useState(false)
  const [optimisticQuantity, setOptimisticQuantity] = useState<number | null>(null)

  // Preload the second image for better hover performance
  useEffect(() => {
    if (secondImage?.url) {
      const imageUrl = `${process.env.NEXT_PUBLIC_SERVER_URL || ''}${secondImage.url}`
      preload(imageUrl, { as: 'image', fetchPriority: 'high' })
    }
  }, [secondImage])

  const addToCart = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      e.stopPropagation()

      // Prevent multiple clicks on the same product
      if (isAdding) return

      setIsAdding(true)

      // Optimistic update: immediately show feedback
      const currentQuantity = optimisticQuantity ?? availableQuantity
      const newQuantity = Math.max(0, currentQuantity - 1)
      setOptimisticQuantity(newQuantity)
      toast.success(`${product.title} added to cart.`)

      // Queue the actual operation to prevent concurrent cart updates
      cartQueue
        .enqueue(() =>
          addItem({
            product: product.id,
          }),
        )
        .catch(() => {
          // Revert optimistic update on error
          setOptimisticQuantity(null)
          toast.error(`Failed to add ${product.title} to cart.`)
        })
        .finally(() => {
          setIsAdding(false)
          // Clear optimistic state after operation completes (success or failure)
          // The real cart state will update via useEffect
          setOptimisticQuantity(null)
        })
    },
    [addItem, product.id, product.title, isAdding, availableQuantity, optimisticQuantity],
  )

  const disabled = useMemo<boolean>(() => {
    // Disable if product has variants enabled (requires variant selection on product page)
    if (product.enableVariants) {
      return true
    }

    const existingItem = cart?.items?.find((item) => {
      const productID = typeof item.product === 'object' ? item.product?.id : item.product
      return productID === product.id
    })

    if (existingItem) {
      const existingQuantity = existingItem.quantity
      return existingQuantity >= (product.inventory || 0)
    }

    if (product.inventory === 0) {
      return true
    }

    return false
  }, [cart?.items, product.id, product.inventory, product.enableVariants])

  // Handle side effects for available quantity
  useEffect(() => {
    const existingItem = cart?.items?.find((item) => {
      const productID = typeof item.product === 'object' ? item.product?.id : item.product
      return productID === product.id
    })

    if (existingItem) {
      const existingQuantity = existingItem.quantity
      setAvailableQuantity((product.inventory || 0) - existingQuantity)
    } else {
      setAvailableQuantity(product.inventory ?? 0)
    }
    // Clear optimistic quantity when real cart updates
    setOptimisticQuantity(null)
  }, [cart?.items, product.id, product.inventory])

  // Use optimistic quantity for display if available, otherwise use real quantity
  const displayQuantity = useMemo(() => {
    return optimisticQuantity !== null ? optimisticQuantity : availableQuantity
  }, [optimisticQuantity, availableQuantity])

  return (
    <Link className="group flex flex-col h-full" href={`/products/${product.slug}`}>
      {firstImage ? (
        <div className="relative aspect-3/4 w-full overflow-hidden border">
          <MediaComponent
            className="relative h-full w-full transition-opacity duration-300 ease-in-out group-hover:opacity-0"
            fill
            imgClassName="h-full w-full object-cover"
            resource={firstImage}
            priority={index < 4}
          />
          {secondImage && (
            <MediaComponent
              className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"
              fill
              imgClassName="h-full w-full object-cover"
              resource={secondImage}
            />
          )}
          <Button
            aria-label="Add to cart"
            className={cn(
              'absolute bottom-4 right-4 size-10 rounded-md bg-black text-white transition-opacity duration-300 ease-in-out hover:bg-black/90 active:bg-black active:opacity-100',
              // Keep visible when loading
              isAdding && 'opacity-100',
              // Mobile: show by default with faded opacity for in-stock items
              !isAdding && displayQuantity > 0 && 'opacity-60 md:opacity-0',
              // Desktop: show on hover
              !isAdding && displayQuantity > 0 && 'md:group-hover:opacity-100',
              // Hide completely when out of stock
              !isAdding && displayQuantity === 0 && 'opacity-0 disabled:opacity-0',
            )}
            disabled={disabled || isAdding}
            onClick={addToCart}
            size="icon"
            type="button"
          >
            {isAdding ? <Loader2 className="size-5 animate-spin" /> : <Plus className="size-5" />}
          </Button>
        </div>
      ) : null}

      <div className="mt-4 flex flex-col gap-1">
        <h6 className="font-medium uppercase">{product.title}</h6>
        {typeof product.priceInPKR === 'number' && (
          <Price
            amount={product.priceInPKR}
            className="text-xs md:text-sm font-light"
            currencyCode="PKR"
          />
        )}

        {displayQuantity > 0 ? (
          <div className="text-sm md:text-base font-light opacity-75 mt-4">
            {displayQuantity} in stock
          </div>
        ) : (
          <div className="text-sm md:text-base font-light opacity-75 mt-4">Out of stock</div>
        )}
      </div>
    </Link>
  )
}

export { ProductCard }

export const CarouselClient: React.FC<{ products: Product[] }> = ({ products }) => {
  if (!products?.length)
    return (
      <div className="w-full h-[480px] flex items-center justify-center border-dashed rounded-md border p-16 gap-4">
        <Info className="size-5" /> <span className="text-sm">No products found</span>
      </div>
    )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ margin: '-124px' }}
    >
      <Carousel className="w-full" opts={{ align: 'start' }}>
        <CarouselContent>
          {products.map((product, i) => (
            <CarouselItem
              key={product.id}
              className="w-4/5 sm:w-3/5 max-w-[480px] flex-none md:w-2/5 lg:w-1/4"
            >
              <ProductCard product={product} index={i} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </motion.div>
  )
}
