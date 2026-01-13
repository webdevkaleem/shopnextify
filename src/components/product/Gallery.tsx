'use client'

import type { Product } from '@/payload-types'

import { GridTileImage } from '@/components/Grid/tile'
import { Media } from '@/components/Media'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useRef } from 'react'

import { Carousel, CarouselApi, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { DefaultDocumentIDType } from 'payload'

type Props = {
  gallery: NonNullable<Product['gallery']>
}

export const Gallery: React.FC<Props> = ({ gallery }) => {
  const searchParams = useSearchParams()
  const [current, setCurrent] = React.useState(0)
  const [api, setApi] = React.useState<CarouselApi>()
  const galleryRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!api) {
      return
    }
  }, [api])

  useEffect(() => {
    const values = searchParams.values().toArray()

    if (values && api) {
      const index = gallery.findIndex((item) => {
        if (!item.variantOption) return false

        let variantID: DefaultDocumentIDType

        if (typeof item.variantOption === 'object') {
          variantID = item.variantOption.id
        } else variantID = item.variantOption

        return Boolean(values.find((value) => value === String(variantID)))
      })
      if (index !== -1) {
        setCurrent(index)
        api.scrollTo(index, true)
      }
    }
  }, [searchParams, api, gallery])

  return (
    <div ref={galleryRef} className="w-full">
      {/* Larger screens - Scrollable gallery with spacing */}
      <div className="relative w-full overflow-visible gap-4 hidden lg:flex flex-wrap">
        {gallery.map((item, i) => {
          if (typeof item.image !== 'object') return null

          return (
            <div className="w-[calc(50%-1rem)] mb-4" key={`${item.image.id}-${i}`}>
              <div className="relative w-full">
                <GridTileImage active={false} media={item.image} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Smaller screens */}
      <div className="relative w-full overflow-hidden mb-8 lg:hidden">
        <Media resource={gallery[current].image} className="w-full" imgClassName="w-full" />
      </div>

      <Carousel setApi={setApi} className="w-full lg:hidden" opts={{ align: 'start', loop: false }}>
        <CarouselContent>
          {gallery.map((item, i) => {
            if (typeof item.image !== 'object') return null

            return (
              <CarouselItem
                className="basis-1/5"
                key={`${item.image.id}-${i}`}
                onClick={() => setCurrent(i)}
              >
                <GridTileImage active={i === current} media={item.image} />
              </CarouselItem>
            )
          })}
        </CarouselContent>
      </Carousel>
    </div>
  )
}
