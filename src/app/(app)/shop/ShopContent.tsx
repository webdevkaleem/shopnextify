import { ProductCard } from '@/blocks/Carousel/Component.client'
import { Grid } from '@/components/Grid'
import { FilterSelect } from '@/components/shop/FilterSelect'
import { SortSelect } from '@/components/shop/SortSelect'
import configPromise from '@payload-config'
import { Info } from 'lucide-react'
import type { Where } from 'payload'
import { getPayload } from 'payload'

type SearchParams = { [key: string]: string | string[] | undefined }

type Props = {
  searchParams: Promise<SearchParams>
}

export async function ShopContent({ searchParams }: Props) {
  const { q: searchValue, sort, category, priceFrom, priceTo, availability } = await searchParams

  const payload = await getPayload({ config: configPromise })

  // Build where conditions array
  const whereConditions: Where[] = [
    {
      _status: {
        equals: 'published',
      },
    },
  ]

  // Search value filter
  if (searchValue && typeof searchValue === 'string') {
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

  // Category filter
  if (category && typeof category === 'string') {
    whereConditions.push({
      categories: {
        in: [category],
      },
    })
  }

  // Price range filter
  if (priceFrom || priceTo) {
    const priceConditions: Where = {}
    if (priceFrom && typeof priceFrom === 'string') {
      const fromValue = parseFloat(priceFrom)
      if (!isNaN(fromValue)) {
        priceConditions.priceInPKR = {
          ...priceConditions.priceInPKR,
          greater_than_equal: fromValue,
        }
      }
    }
    if (priceTo && typeof priceTo === 'string') {
      const toValue = parseFloat(priceTo)
      if (!isNaN(toValue)) {
        priceConditions.priceInPKR = {
          ...priceConditions.priceInPKR,
          less_than_equal: toValue,
        }
      }
    }
    if (Object.keys(priceConditions).length > 0) {
      whereConditions.push(priceConditions)
    }
  }

  // Availability filter
  if (availability && typeof availability === 'string') {
    const availabilityArray = availability.split(',').filter(Boolean)
    const inStockSelected = availabilityArray.includes('in_stock')
    const outOfStockSelected = availabilityArray.includes('out_of_stock')

    if (inStockSelected && !outOfStockSelected) {
      // Only in stock - products with inventory > 0
      // Note: For products with variants, we'll filter them client-side or use a different approach
      whereConditions.push({
        inventory: {
          greater_than: 0,
        },
      })
    } else if (outOfStockSelected && !inStockSelected) {
      // Only out of stock - products with inventory <= 0 or no inventory
      whereConditions.push({
        or: [
          {
            inventory: {
              less_than_equal: 0,
            },
          },
          {
            inventory: {
              exists: false,
            },
          },
        ],
      })
    }
    // If both are selected, don't filter by availability
  }

  const products = await payload.find({
    collection: 'products',
    draft: false,
    overrideAccess: false,
    ...(sort ? { sort } : { sort: 'title' }),
    ...(whereConditions.length > 0
      ? {
          where: {
            and: whereConditions,
          },
        }
      : {}),
  })

  return (
    <div className="min-h-[50vh] w-full flex flex-col">
      <div className="flex items-center mb-6">
        <div className="flex flex-col-reverse md:flex-row gap-4 md:items-center justify-between w-full">
          <div className="flex gap-4 items-center w-full">
            <div className="hidden md:block">
              <FilterSelect />
            </div>

            <p className="text-sm">
              Showing {products.docs.length} of {products.totalDocs} products
            </p>
          </div>
          <div className="flex gap-4 items-center">
            <div className="block md:hidden">
              <FilterSelect />
            </div>
            <SortSelect />
          </div>
        </div>
      </div>

      {products.docs?.length === 0 && (
        <div className="flex flex-1 justify-center items-center gap-4">
          <Info className="size-8" />
          <h2 className="text-2xl font-light">No products found.</h2>
        </div>
      )}

      {products?.docs.length > 0 ? (
        <Grid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.docs.map((product, i) => {
            return <ProductCard key={product.id} product={product} index={i} />
          })}
        </Grid>
      ) : null}
    </div>
  )
}
