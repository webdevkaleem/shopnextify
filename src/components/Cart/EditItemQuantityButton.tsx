'use client'

import { CartItem } from '@/components/Cart'
import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import clsx from 'clsx'
import { MinusIcon, PlusIcon } from 'lucide-react'
import React, { useMemo } from 'react'

interface EditItemQuantityButtonProps {
  item: CartItem
  type: 'minus' | 'plus'
  onOptimisticUpdate?: (itemId: string) => void
  onError?: (itemId: string, operation: 'increment' | 'decrement') => void
  onSuccess?: (itemId: string, operation: 'increment' | 'decrement') => void
  isPending?: boolean
}

export function EditItemQuantityButton({
  type,
  item,
  onOptimisticUpdate,
  onError,
  onSuccess,
  isPending = false,
}: EditItemQuantityButtonProps) {
  const { decrementItem, incrementItem, isLoading } = useCart()

  const disabled = useMemo(() => {
    if (!item.id) return true

    const target =
      item.variant && typeof item.variant === 'object'
        ? item.variant
        : item.product && typeof item.product === 'object'
          ? item.product
          : null

    if (
      target &&
      typeof target === 'object' &&
      target.inventory !== undefined &&
      target.inventory !== null
    ) {
      if (type === 'plus' && item.quantity !== undefined && item.quantity !== null) {
        return item.quantity >= target.inventory
      }
    }

    return false
  }, [item, type])

  const handleClick = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (!item.id) return

    const operation = type === 'plus' ? 'increment' : 'decrement'
    const cartOperation = type === 'plus' ? incrementItem : decrementItem

    // Optimistic update - happens immediately for instant feedback
    if (onOptimisticUpdate) {
      onOptimisticUpdate(item.id)
    }

    try {
      // Perform the actual cart operation (handle both promise and non-promise returns)
      const result = cartOperation(item.id)
      await Promise.resolve(result)

      // Success callback
      if (onSuccess) {
        onSuccess(item.id, operation)
      }
    } catch (error) {
      // Revert on error
      console.error('Cart operation failed:', error)
      if (onError) {
        onError(item.id, operation)
      }
    }
  }

  const isDisabled = disabled || isLoading || isPending

  return (
    <form>
      <button
        disabled={isDisabled}
        aria-label={type === 'plus' ? 'Increase item quantity' : 'Reduce item quantity'}
        className={clsx(
          'ease flex h-full min-w-[36px] max-w-[36px] flex-none items-center justify-center rounded-full px-2 transition-all duration-200',
          {
            'cursor-not-allowed opacity-50': isDisabled,
            'cursor-pointer': !isDisabled,
            'ml-auto': type === 'minus',
          },
        )}
        onClick={handleClick}
        type="button"
      >
        {type === 'plus' ? (
          <PlusIcon className="h-4 w-4 dark:text-neutral-500" />
        ) : (
          <MinusIcon className="h-4 w-4 dark:text-neutral-500" />
        )}
      </button>
    </form>
  )
}
