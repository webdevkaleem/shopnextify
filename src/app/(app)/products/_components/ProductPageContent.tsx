import type { Media } from '@/payload-types'

import { CarouselClient } from '@/blocks/Carousel/Component.client'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { Gallery } from '@/components/product/Gallery'
import { ProductDescription } from '@/components/product/ProductDescription'
import configPromise from '@payload-config'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import * as motion from 'motion/react-client'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React, { Suspense } from 'react'
import { MoreInformation } from '../[slug]/_sections/more-information'
import PinnedHeader from '../[slug]/_sections/pinned-header'

type ProductPageContentProps = {
  slug: string
}

export async function ProductPageContent({ slug }: ProductPageContentProps) {
  const product = await queryProductBySlug({ slug })

  if (!product) return notFound()

  const gallery =
    product.gallery
      ?.filter((item) => typeof item.image === 'object')
      .map((item) => ({
        ...item,
        image: item.image as Media,
      })) || []

  const metaImage = typeof product.meta?.image === 'object' ? product.meta?.image : undefined
  const hasStock = product.enableVariants
    ? product?.variants?.docs?.some((variant) => {
        if (typeof variant !== 'object') return false
        return variant.inventory && variant?.inventory > 0
      })
    : (product.inventory ?? 0) > 0

  let price = product.priceInPKR

  if (product.enableVariants && product?.variants?.docs?.length) {
    price = product?.variants?.docs?.reduce((acc, variant) => {
      if (typeof variant === 'object' && variant?.priceInPKR && acc && variant?.priceInPKR > acc) {
        return variant.priceInPKR
      }
      return acc
    }, price)
  }

  const productJsonLd = {
    name: product.title,
    '@context': 'https://schema.org',
    '@type': 'Product',
    description: product.description,
    image: metaImage?.url,
    offers: {
      '@type': 'AggregateOffer',
      availability: hasStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      price: price,
      priceCurrency: 'PKR',
    },
  }

  const relatedProducts =
    product.relatedProducts?.filter((relatedProduct) => typeof relatedProduct === 'object') ?? []

  const payload = await getPayload({ config: configPromise })

  const storeGlobal = await payload.findGlobal({ slug: 'store', depth: 1 })
  const storeCards = storeGlobal?.storeCards || []
  const storeDeliveryAndReturnsPolicy = storeGlobal?.deliveryAndReturnsPolicy

  return (
    <React.Fragment>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd),
        }}
        type="application/ld+json"
      />
      <PinnedHeader product={product} />

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ margin: '-124px' }}
        className={'container py-16'}
      >
        <div className="relative flex flex-col gap-12 lg:flex-row lg:gap-8 lg:items-start">
          {/* Gallery Container - Scrollable */}
          <div className="w-full basis-full lg:basis-3/5">
            <Suspense
              fallback={
                <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden" />
              }
            >
              {Boolean(gallery?.length) && <Gallery gallery={gallery} />}
            </Suspense>
          </div>

          {/* Product Description - Sticky */}
          <div className="w-full basis-full lg:basis-2/5 lg:sticky lg:top-24 lg:self-start">
            <ProductDescription product={product} storeCards={storeCards} />
          </div>
        </div>
      </motion.div>

      <MoreInformation
        product={product}
        storeDeliveryAndReturnsPolicy={storeDeliveryAndReturnsPolicy}
      />

      {product.layout?.length ? <RenderBlocks blocks={product.layout} /> : <></>}

      {relatedProducts.length ? (
        <div className="container py-20 flex flex-col gap-8">
          {/* Header Section */}
          <div className="flex items-center justify-between gap-8">
            <h2 className="text-4xl font-light">You may also like</h2>
            <div className="flex items-center gap-8">
              <div className="hidden md:flex items-center justify-center gap-4">
                <ChevronLeft className="w-4 h-4" />
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Product Scroller */}
          <div className="w-full">
            <CarouselClient products={relatedProducts} />
          </div>
        </div>
      ) : (
        <></>
      )}
    </React.Fragment>
  )
}

const queryProductBySlug = async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'products',
    depth: 3,
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      and: [
        {
          slug: {
            equals: slug,
          },
        },
        ...(draft ? [] : [{ _status: { equals: 'published' } }]),
      ],
    },
    populate: {
      variants: {
        title: true,
        priceInPKR: true,
        inventory: true,
        options: true,
      },
    },
  })

  return result.docs?.[0] || null
}
