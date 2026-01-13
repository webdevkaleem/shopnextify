'use client'

import type { CartItem } from '@/components/Cart'
import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import { Trash } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'

interface DeleteItemButtonProps {
  item: CartItem
  onOptimisticUpdate?: (itemId: string) => void
  onError?: (itemId: string, operation: 'remove') => void
  onSuccess?: (itemId: string, operation: 'remove') => void
  isPending?: boolean
}

export function DeleteItemButton({
  item,
  onOptimisticUpdate,
  onError,
  onSuccess,
  isPending = false,
}: DeleteItemButtonProps) {
  const { isLoading, removeItem } = useCart()
  const itemId = item.id

  const handleClick = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!itemId) return

    // Optimistic update - happens immediately for instant feedback
    if (onOptimisticUpdate) {
      onOptimisticUpdate(itemId)
    }

    try {
      // Perform the actual cart operation (handle both promise and non-promise returns)
      const result = removeItem(itemId)
      await Promise.resolve(result)

      // Success callback
      if (onSuccess) {
        onSuccess(itemId, 'remove')
      }
    } catch (error) {
      // Revert on error
      console.error('Cart operation failed:', error)
      if (onError) {
        onError(itemId, 'remove')
      }
    }
  }

  const isDisabled = !itemId || isLoading || isPending

  return (
    <form>
      <Button
        aria-label="Remove cart item"
        variant="ghostDestructive"
        size="icon"
        disabled={isDisabled}
        onClick={handleClick}
        type="button"
      >
        <Trash className="size-4" />
      </Button>
    </form>
  )
}
