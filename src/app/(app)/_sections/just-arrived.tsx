import { CarouselClient } from '@/blocks/Carousel/Component.client'
import { CMSLink } from '@/components/Link'
import { Product } from '@/payload-types'
import config from '@payload-config'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getPayload } from 'payload'
import type { JSX } from 'react'

export default async function JustArrived(): Promise<JSX.Element> {
  const payload = await getPayload({ config })

  // Fetch the page by slug to get the full Page object
  const { docs } = await payload.find({
    collection: 'pages',
    where: {
      slug: { equals: 'just-arrived' },
    },
    limit: 10,
    depth: 2,
  })

  const page = docs[0]

  const products = (page?.featuredProducts || []) as Product[]

  return (
    <div className="container py-20 flex flex-col gap-8">
      {/* Header Section */}
      <div className="flex items-center justify-between gap-8">
        <h2 className="text-4xl font-light">Just Arrived</h2>
        <div className="flex items-center gap-8">
          <CMSLink
            className="text-xs"
            type="reference"
            reference={{ relationTo: 'pages', value: page }}
          >
            View All
          </CMSLink>

          <div className="hidden md:flex items-center justify-center gap-4">
            <ChevronLeft className="w-4 h-4" />
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Product Scroller */}
      <div className="w-full">
        <CarouselClient products={products} />
      </div>
    </div>
  )
}
