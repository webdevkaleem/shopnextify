'use client'
import type { Product, Variant } from '@/payload-types'

import { AddToCart } from '@/components/Cart/AddToCart'
import { Price } from '@/components/Price'
import { RichText } from '@/components/RichText'
import { Suspense } from 'react'

import { StockIndicator } from '@/components/product/StockIndicator'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { useCurrency } from '@payloadcms/plugin-ecommerce/client/react'
import AutoScroll from 'embla-carousel-auto-scroll'
import { Store } from 'lucide-react'
import { VariantSelector } from './VariantSelector'

export function ProductDescription({
  product,
  storeCards,
}: {
  product: Product
  storeCards: {
    card: string
    id?: string | null
  }[]
}) {
  const { currency } = useCurrency()
  let amount = 0,
    lowestAmount = 0,
    highestAmount = 0
  const priceField = `priceIn${currency.code}` as keyof Product
  const hasVariants = product.enableVariants && Boolean(product.variants?.docs?.length)

  if (hasVariants) {
    const priceField = `priceIn${currency.code}` as keyof Variant
    const variantsOrderedByPrice = product.variants?.docs
      ?.filter((variant) => variant && typeof variant === 'object')
      .sort((a, b) => {
        if (
          typeof a === 'object' &&
          typeof b === 'object' &&
          priceField in a &&
          priceField in b &&
          typeof a[priceField] === 'number' &&
          typeof b[priceField] === 'number'
        ) {
          return a[priceField] - b[priceField]
        }

        return 0
      }) as Variant[]

    const lowestVariant = variantsOrderedByPrice[0][priceField]
    const highestVariant = variantsOrderedByPrice[variantsOrderedByPrice.length - 1][priceField]
    if (
      variantsOrderedByPrice &&
      typeof lowestVariant === 'number' &&
      typeof highestVariant === 'number'
    ) {
      lowestAmount = lowestVariant
      highestAmount = highestVariant
    }
  } else if (product[priceField] && typeof product[priceField] === 'number') {
    amount = product[priceField]
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-light">{product.title}</h1>
        <div className="">
          {hasVariants ? (
            <Price highestAmount={highestAmount} lowestAmount={lowestAmount} />
          ) : (
            <Price amount={amount} />
          )}
        </div>
      </div>
      {product.description ? (
        <RichText className="" data={product.description} enableGutter={false} />
      ) : null}
      {hasVariants && (
        <>
          <Suspense fallback={null}>
            <VariantSelector product={product} />
          </Suspense>

          <hr />
        </>
      )}

      <div className="flex items-center justify-between">
        <Suspense fallback={null}>
          <AddToCart product={product} />
        </Suspense>
      </div>

      <div className="flex items-center justify-between">
        <Suspense fallback={null}>
          <StockIndicator product={product} />
        </Suspense>
      </div>

      {storeCards.length > 0 && (
        <>
          {/* Mobile Carousel - Auto-scrolling */}
          <div className="lg:hidden">
            <Carousel
              plugins={[
                AutoScroll({
                  stopOnInteraction: false,
                  stopOnMouseEnter: true,
                  speed: 1,
                }),
              ]}
              opts={{
                align: 'start',
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {storeCards.map((card) => (
                  <CarouselItem key={card.id} className="basis-full">
                    <div className="flex flex-col p-4 border h-24 rounded-md w-full items-center gap-3 justify-center">
                      <Store className="size-4" />
                      <span className="truncate text-xs line-clamp-2 block w-full text-center">
                        {card.card}
                      </span>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>

          {/* Desktop Grid */}
          <div className="hidden gap-4 flex-wrap lg:flex">
            {storeCards.map((card) => (
              <div
                key={card.id}
                className="flex flex-col p-4 border h-24 rounded-md w-[calc(50%-0.5rem)] items-center gap-3 justify-center"
              >
                <Store className="size-4" />
                <span className="truncate select-none text-xs line-clamp-2 block w-full text-center">
                  {card.card}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
