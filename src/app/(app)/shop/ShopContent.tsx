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
  const { q: searchValue, sort, categories, priceFrom, priceTo, availability } = await searchParams

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

  // Categories filter (AND logic - product must have ALL selected categories)
  if (categories && typeof categories === 'string') {
    // Handle comma-separated category IDs
    const categoryArray = categories.split(',').filter(Boolean)
    if (categoryArray.length > 0) {
      // Use AND logic: product must contain ALL selected categories
      // For hasMany relationship fields, use 'in' with single value for each category
      if (categoryArray.length === 1) {
        // Single category - use in with single value
        whereConditions.push({
          categories: {
            in: [categoryArray[0]],
          },
        })
      } else {
        // Multiple categories - use AND with multiple 'in' checks (each checking for one category)
        whereConditions.push({
          and: categoryArray.map((categoryId) => ({
            categories: {
              in: [categoryId],
            },
          })),
        })
      }
    }
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

  // Fetch all categories
  const { docs: allCategories } = await payload.find({
    collection: 'categories',
    overrideAccess: false,
    sort: 'title',
  })

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
              <FilterSelect categories={allCategories} />
            </div>

            <p className="text-sm">
              Showing {products.docs.length} of {products.totalDocs} products
            </p>
          </div>
          <div className="flex gap-4 items-center">
            <div className="block md:hidden">
              <FilterSelect categories={allCategories} />
            </div>
            <SortSelect />
          </div>
        </div>
      </div>

      {products.docs?.length === 0 && (
        <div className="flex flex-1 justify-center items-center gap-4">
          <Info />
          <p>No products found.</p>
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
