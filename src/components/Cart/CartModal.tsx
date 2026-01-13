'use client'

import { Price } from '@/components/Price'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Cart as CartType, Product } from '@/payload-types'
import { CMSLink } from '../Link'
import { DeleteItemButton } from './DeleteItemButton'
import { EditItemQuantityButton } from './EditItemQuantityButton'
import { OpenCartButton } from './OpenCart'

export function CartModal() {
  const { cart } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const [optimisticCart, setOptimisticCart] = useState<CartType | null>(null)
  const [pendingOperations, setPendingOperations] = useState<Set<string>>(new Set())
  const previousCartRef = useRef<CartType | null>(null)

  const pathname = usePathname()

  useEffect(() => {
    // Close the cart modal when the pathname changes.
    setIsOpen(false)
  }, [pathname])

  // Sync optimistic cart with real cart when it updates
  useEffect(() => {
    if (cart) {
      // Only update if cart actually changed (not just a re-render)
      const cartChanged =
        !previousCartRef.current ||
        previousCartRef.current.updatedAt !== cart.updatedAt ||
        JSON.stringify(previousCartRef.current.items) !== JSON.stringify(cart.items)

      if (cartChanged) {
        setOptimisticCart(cart)
        setPendingOperations(new Set())
        previousCartRef.current = cart
      }
    } else {
      setOptimisticCart(null)
      setPendingOperations(new Set())
      previousCartRef.current = null
    }
  }, [cart])

  // Use optimistic cart for display, fallback to real cart
  const displayCart = useMemo(() => optimisticCart || cart, [optimisticCart, cart])

  const totalQuantity = useMemo(() => {
    if (!displayCart || !displayCart.items || !displayCart.items.length) return undefined
    return displayCart.items.reduce((quantity, item) => (item.quantity || 0) + quantity, 0)
  }, [displayCart])

  // Calculate optimistic subtotal
  const optimisticSubtotal = useMemo(() => {
    if (!displayCart?.items || !displayCart.items.length) return displayCart?.subtotal || 0

    return displayCart.items.reduce((total, item) => {
      const product = item.product
      const variant = item.variant
      let price = 0

      if (typeof product === 'object' && product) {
        price = product.priceInPKR || 0

        if (variant && typeof variant === 'object' && variant.priceInPKR) {
          price = variant.priceInPKR
        }
      }

      return total + price * (item.quantity || 0)
    }, 0)
  }, [displayCart])

  // Optimistic update handlers
  const handleOptimisticIncrement = useMemo(
    () => (itemId: string) => {
      if (!displayCart?.items) return

      setOptimisticCart((prev) => {
        if (!prev) return prev
        const newItems = prev.items?.map((item) => {
          if (item.id === itemId) {
            return { ...item, quantity: (item.quantity || 0) + 1 }
          }
          return item
        })
        return { ...prev, items: newItems || [] }
      })

      setPendingOperations((prev) => new Set(prev).add(`increment-${itemId}`))
    },
    [displayCart],
  )

  const handleOptimisticDecrement = useMemo(
    () => (itemId: string) => {
      if (!displayCart?.items) return

      setOptimisticCart((prev) => {
        if (!prev) return prev
        const newItems = prev.items?.map((item) => {
          if (item.id === itemId) {
            const newQuantity = Math.max(0, (item.quantity || 0) - 1)
            // Remove item if quantity becomes 0
            if (newQuantity === 0) {
              return null
            }
            return { ...item, quantity: newQuantity }
          }
          return item
        })
        return {
          ...prev,
          items: newItems?.filter((item): item is NonNullable<typeof item> => item !== null) || [],
        }
      })

      setPendingOperations((prev) => new Set(prev).add(`decrement-${itemId}`))
    },
    [displayCart],
  )

  const handleOptimisticRemove = useMemo(
    () => (itemId: string) => {
      if (!displayCart?.items) return

      setOptimisticCart((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          items: prev.items?.filter((item) => item.id !== itemId) || [],
        }
      })

      setPendingOperations((prev) => new Set(prev).add(`remove-${itemId}`))
    },
    [displayCart],
  )

  // Error handler to revert optimistic updates
  const handleOperationError = useMemo(
    () => (itemId: string, operation: 'increment' | 'decrement' | 'remove') => {
      // Revert to real cart state
      if (cart) {
        setOptimisticCart(cart)
      }
      setPendingOperations((prev) => {
        const next = new Set(prev)
        next.delete(`${operation}-${itemId}`)
        return next
      })
    },
    [cart],
  )

  // Clear pending operation on success
  const handleOperationSuccess = useMemo(
    () => (itemId: string, operation: 'increment' | 'decrement' | 'remove') => {
      setPendingOperations((prev) => {
        const next = new Set(prev)
        next.delete(`${operation}-${itemId}`)
        return next
      })
    },
    [],
  )

  return (
    <Sheet onOpenChange={setIsOpen} open={isOpen}>
      <SheetTrigger asChild>
        <OpenCartButton quantity={totalQuantity} />
      </SheetTrigger>

      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Your cart</SheetTitle>
        </SheetHeader>

        {!displayCart || displayCart?.items?.length === 0 ? (
          <div className="text-center flex flex-col items-center px-8 justify-center gap-4 flex-1">
            <h2 className="text-center text-4xl font-light">It&apos;s a little empty here</h2>
            <p>Your cart is currently empty</p>
            <CMSLink url="/shop" type="internalCustom" appearance="outline">
              START SHOPPING
            </CMSLink>
          </div>
        ) : (
          <>
            {/* Scrollable items section */}
            <div className="flex-1 overflow-y-auto px-4">
              <ul className="py-4">
                {displayCart?.items?.map((item, i) => {
                  const product = item.product
                  const variant = item.variant

                  if (typeof product !== 'object' || !item || !product || !product.slug)
                    return <React.Fragment key={i} />

                  const metaImage =
                    product.meta?.image && typeof product.meta?.image === 'object'
                      ? product.meta.image
                      : undefined

                  const firstGalleryImage =
                    typeof product.gallery?.[0]?.image === 'object'
                      ? product.gallery?.[0]?.image
                      : undefined

                  let image = firstGalleryImage || metaImage
                  let price = product.priceInPKR

                  const isVariant = Boolean(variant) && typeof variant === 'object'

                  if (isVariant) {
                    price = variant?.priceInPKR

                    const imageVariant = product.gallery?.find((item) => {
                      if (!item.variantOption) return false
                      const variantOptionID =
                        typeof item.variantOption === 'object'
                          ? item.variantOption.id
                          : item.variantOption

                      const hasMatch = variant?.options?.some((option) => {
                        if (typeof option === 'object') return option.id === variantOptionID
                        else return option === variantOptionID
                      })

                      return hasMatch
                    })

                    if (imageVariant && typeof imageVariant.image === 'object') {
                      image = imageVariant.image
                    }
                  }

                  return (
                    <li className="flex w-full flex-col" key={item.id}>
                      <div className="relative flex w-full flex-row justify-between px-1 py-4">
                        <Link
                          className="z-30 flex flex-row space-x-4"
                          href={`/products/${(item.product as Product)?.slug}`}
                        >
                          <div className="relative h-32 w-32 cursor-pointer overflow-hidden border border-foreground/25 bg-foreground">
                            {image?.url && (
                              <Image
                                alt={image?.alt || product?.title || ''}
                                className="h-full w-full object-cover"
                                height={94}
                                src={image.url}
                                width={94}
                              />
                            )}
                          </div>
                        </Link>
                        <div className="flex sm:flex-row flex-col flex-1 justify-between gap-8">
                          <div className="flex flex-1 flex-col gap-2 px-4">
                            <span className="leading-tight">{product?.title}</span>
                            {typeof price === 'number' && (
                              <Price amount={price} className="text-sm" />
                            )}

                            {isVariant && variant ? (
                              <p className="text-sm capitalize">
                                {variant.options
                                  ?.map((option) => {
                                    if (typeof option === 'object') return option.label
                                    return null
                                  })
                                  .join(', ')}
                              </p>
                            ) : null}
                          </div>
                          <div className="flex gap-4 items-center sm:flex-col sm:items-end">
                            <div className="flex items-center h-fit justify-center">
                              <DeleteItemButton
                                item={item}
                                onOptimisticUpdate={handleOptimisticRemove}
                                onError={handleOperationError}
                                onSuccess={handleOperationSuccess}
                                isPending={pendingOperations.has(`remove-${item.id}`)}
                              />
                              <div className="ml-auto flex h-9 flex-row items-center rounded-lg border">
                                <EditItemQuantityButton
                                  item={item}
                                  type="minus"
                                  onOptimisticUpdate={handleOptimisticDecrement}
                                  onError={handleOperationError}
                                  onSuccess={handleOperationSuccess}
                                  isPending={pendingOperations.has(`decrement-${item.id}`)}
                                />
                                <p className="w-6 text-center">
                                  <span className="w-full text-sm">{item.quantity}</span>
                                </p>
                                <EditItemQuantityButton
                                  item={item}
                                  type="plus"
                                  onOptimisticUpdate={handleOptimisticIncrement}
                                  onError={handleOperationError}
                                  onSuccess={handleOperationSuccess}
                                  isPending={pendingOperations.has(`increment-${item.id}`)}
                                />
                              </div>
                            </div>
                            <div className="flex items-center min-w-[80px] sm:justify-end">
                              {typeof price === 'number' && (
                                <Price
                                  amount={price * (item.quantity || 0)}
                                  className="text-sm font-medium"
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* Sticky footer */}
            <div className="border-t border-foreground/25 px-4 py-4 mt-auto">
              {typeof optimisticSubtotal === 'number' && optimisticSubtotal > 0 && (
                <div className="mb-3 flex items-center justify-between pb-1">
                  <h5 className="text-xl font-light">Subtotal</h5>
                  <Price amount={optimisticSubtotal} className="text-right" />
                </div>
              )}

              <Button asChild className="w-full">
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
