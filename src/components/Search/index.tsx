'use client'

import { cn } from '@/utilities/cn'
import { createUrl } from '@/utilities/createUrl'
import { SearchIcon } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { Input } from '../ui/input'

type Props = {
  className?: string
  navigate?: boolean
}

export const Search: React.FC<Props> = ({ className, navigate = true }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const [inputValue, setInputValue] = useState('')
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const isUpdatingFromDebounceRef = useRef(false)

  // Initialize input value from URL params when component mounts
  useEffect(() => {
    const currentSearchValue = searchParams?.get('q') || ''
    setInputValue(currentSearchValue)
  }, []) // Only run on mount

  // Sync input value when URL params change externally (not from our debounce)
  useEffect(() => {
    if (isUpdatingFromDebounceRef.current) {
      isUpdatingFromDebounceRef.current = false
      return
    }
    const currentSearchValue = searchParams?.get('q') || ''
    if (currentSearchValue !== inputValue) {
      setInputValue(currentSearchValue)
    }
  }, [searchParams])

  // Debounce input changes and update URL params
  useEffect(() => {
    // Get current URL search value
    const currentUrlValue = searchParams?.get('q') || ''
    const trimmedInputValue = inputValue.trim()

    // Only update if the value actually changed
    if (trimmedInputValue === currentUrlValue) {
      return
    }

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // Set up debounce timer
    debounceTimerRef.current = setTimeout(() => {
      const newParams = new URLSearchParams(searchParams?.toString() ?? '')

      if (trimmedInputValue) {
        newParams.set('q', trimmedInputValue)
      } else {
        newParams.delete('q')
      }

      // Mark that we're updating from debounce to prevent sync loop
      isUpdatingFromDebounceRef.current = true

      if (navigate) {
        router.push(createUrl('/shop', newParams))
      } else {
        router.push(createUrl(pathname, newParams))
      }
    }, 500) // 0.5 second debounce

    // Cleanup timer on unmount or when inputValue changes
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [inputValue, searchParams, router, pathname, navigate])

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    // Clear debounce timer and update immediately
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    const newParams = new URLSearchParams(searchParams?.toString() ?? '')

    if (inputValue.trim()) {
      newParams.set('q', inputValue.trim())
    } else {
      newParams.delete('q')
    }

    // Mark that we're updating from submit to prevent sync loop
    isUpdatingFromDebounceRef.current = true

    if (navigate) {
      router.push(createUrl('/shop', newParams))
    } else {
      router.push(createUrl(pathname, newParams))
    }
  }

  return (
    <form className={cn('relative w-full', className)} onSubmit={onSubmit}>
      <Input
        autoComplete="off"
        name="search"
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Start typing to search for products..."
        type="text"
        value={inputValue}
      />
      <div className="absolute right-0 top-0 mr-3 flex h-full items-center">
        <SearchIcon className="h-4" />
      </div>
    </form>
  )
}
