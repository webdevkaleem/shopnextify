import { CarouselClient } from '@/blocks/Carousel/Component.client'
import { CMSLink } from '@/components/Link'
import config from '@payload-config'
import { getPayload } from 'payload'
import type { JSX } from 'react'

export default async function JustArrived(): Promise<JSX.Element> {
  const payload = await getPayload({ config })

  const { docs: categories } = await payload.find({
    collection: 'categories',
    overrideAccess: false,
    where: {
      slug: { equals: 'just-arrived' },
    },
    limit: 1,
  })

  const categoryId = categories[0]?.id

  // Fetch products for the Just Arrived section
  const { docs } = await payload.find({
    collection: 'products',
    overrideAccess: false,
    where: {
      categories: { equals: categoryId },
    },
    limit: 10,
    depth: 2,
  })

  const products = docs

  return (
    <div className="container py-20 flex flex-col gap-8">
      {/* Header Section */}
      <div className="flex items-center justify-between gap-8">
        <h2 className="text-4xl font-light">Just Arrived</h2>
        <div className="flex items-center gap-8">
          <CMSLink className="text-xs" type="reference" url={`/shop?categories=${categoryId}`}>
            View All
          </CMSLink>
        </div>
      </div>

      {/* Product Scroller */}
      <div className="w-full">
        <CarouselClient products={products} />
      </div>
    </div>
  )
}
