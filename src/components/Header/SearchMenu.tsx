'use client'

import type { Product } from '@/payload-types'
import { createUrl } from '@/utilities/createUrl'
import { Loader2, Search as SearchIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { stringify } from 'qs-esm'
import { useEffect, useRef, useState } from 'react'
import { RichText } from '../RichText'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet'

type ProductsResponse = {
  docs: Product[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
}

export default function SearchMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState('')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const searchValue = searchParams?.get('q')
  const sort = searchParams?.get('sort')
  const category = searchParams?.get('category')
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
      const newParams = new URLSearchParams(searchParams.toString())

      if (trimmedInputValue) {
        newParams.set('q', trimmedInputValue)
      } else {
        newParams.delete('q')
      }

      // Mark that we're updating from debounce to prevent sync loop
      isUpdatingFromDebounceRef.current = true
      router.push(createUrl(pathname, newParams))
    }, 500) // 0.5 second debounce

    // Cleanup timer on unmount or when inputValue changes
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [inputValue, searchParams, router, pathname])

  useEffect(() => {
    const fetchProducts = async () => {
      // Only fetch if there's a search value or category
      if (!searchValue && !category) {
        setProducts([])
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        // Build where clause for PayloadCMS REST API
        const whereConditions: any[] = [
          {
            _status: {
              equals: 'published',
            },
          },
        ]

        if (searchValue) {
          whereConditions.push({
            or: [
              {
                title: {
                  like: searchValue,
                },
              },
              {
                description: {
                  like: searchValue,
                },
              },
            ],
          })
        }

        if (category) {
          whereConditions.push({
            categories: {
              contains: category,
            },
          })
        }

        // Build query parameters using qs-esm
        const queryParams = {
          where: {
            and: whereConditions,
          },
          depth: 2, // Populate relationships for product display
          ...(sort ? { sort } : { sort: 'title' }),
        }

        const queryString = stringify(queryParams, { addQueryPrefix: true })

        // Use PayloadCMS REST API endpoint
        const response = await fetch(`/api/products${queryString}`)

        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }

        const data: ProductsResponse = await response.json()
        setProducts(data.docs || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        setProducts([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [searchValue, sort, category])

  return (
    <Sheet onOpenChange={setIsOpen} open={isOpen}>
      <SheetTrigger asChild>
        <Button variant="fade" size="clear">
          <SearchIcon className="size-5 text-current" />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Search</SheetTitle>
        </SheetHeader>

        <div className="px-4 flex flex-col gap-4 flex-1 min-h-0">
          <div className="relative w-full">
            <form
              className="relative w-full"
              onSubmit={(e) => {
                e.preventDefault()
                // Clear debounce timer and update immediately
                if (debounceTimerRef.current) {
                  clearTimeout(debounceTimerRef.current)
                }
                const newParams = new URLSearchParams(searchParams.toString())
                if (inputValue.trim()) {
                  newParams.set('q', inputValue.trim())
                } else {
                  newParams.delete('q')
                }
                // Mark that we're updating from submit to prevent sync loop
                isUpdatingFromDebounceRef.current = true
                router.push(createUrl(pathname, newParams))
              }}
            >
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
          </div>

          {isLoading && (
            <div className="flex items-center flex-1 min-h-0 justify-center py-8">
              <Loader2 className="size-6 animate-spin" />
            </div>
          )}

          {error && <div className="text-sm text-red-500 py-4">{error}</div>}

          {!isLoading && !error && searchValue && products.length === 0 && (
            <div className="text-sm flex-col gap-2 text-muted-foreground flex items-center py-4 flex-1 min-h-0 justify-center">
              <h2 className="text-2xl font-light">
                Oh no! No results found for &quot;{searchValue}&quot;
              </h2>
              <p className="opacity-75">Please try again with a different query.</p>
            </div>
          )}

          {!isLoading && !error && products.length > 0 && (
            <div className="flex flex-col flex-1 min-h-0">
              <p className="text-sm text-muted-foreground mb-4">
                Found {products.length} {products.length === 1 ? 'result' : 'results'}
                {searchValue && ` for "${searchValue}"`}
              </p>
              <div className="flex-1 overflow-y-auto min-h-0">
                <ul className="py-4">
                  {products.map((product) => {
                    if (!product || !product.slug) return null

                    const metaImage =
                      product.meta?.image && typeof product.meta?.image === 'object'
                        ? product.meta.image
                        : undefined

                    const firstGalleryImage =
                      typeof product.gallery?.[0]?.image === 'object'
                        ? product.gallery?.[0]?.image
                        : undefined

                    const image = firstGalleryImage || metaImage
                    const price = product.priceInPKR

                    return (
                      <li className="flex w-full flex-col" key={product.id}>
                        <Link
                          className="relative flex w-full flex-row justify-between p-4 hover:bg-foreground/5 transition-colors"
                          href={`/products/${product.slug}`}
                          onClick={() => setIsOpen(false)}
                        >
                          <div className="z-30 flex flex-row space-x-4 flex-1">
                            <div className="relative h-24 w-24 cursor-pointer overflow-hidden border border-foreground/25 bg-foreground shrink-0">
                              {image?.url ? (
                                <Image
                                  alt={image?.alt || product?.title || ''}
                                  className="h-full w-full object-cover"
                                  height={96}
                                  src={image.url}
                                  width={96}
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
                                  No Image
                                </div>
                              )}
                            </div>
                            <div className="flex flex-1 flex-col gap-2 px-4 justify-center">
                              <span className="leading-tight font-light">{product?.title}</span>
                              <div className="line-clamp-2">
                                {product.description ? (
                                  <RichText
                                    className="[&_*]:text-sm"
                                    data={product.description}
                                    enableGutter={false}
                                    enableProse={false}
                                  />
                                ) : null}{' '}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
