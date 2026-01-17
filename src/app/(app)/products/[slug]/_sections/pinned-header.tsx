'use client'

import { AddToCart } from '@/components/Cart/AddToCart'
import { Media } from '@/components/Media'
import { Price } from '@/components/Price'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Product } from '@/payload-types'
import * as motion from 'motion/react-client'
import { Suspense, useEffect, useState } from 'react'

export default function PinnedHeader({ product }: { product: Product }) {
  const [scrollY, setScrollY] = useState(0)
  const [screenHeight, setScreenHeight] = useState(0)

  useEffect(() => {
    setScreenHeight(window.innerHeight)
  }, [])

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: scrollY > screenHeight ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      className={
        'fixed top-16 left-0 h-16 z-40 w-full border-t border-t-background bg-foreground text-background flex items-center'
      }
    >
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12 overflow-hidden">
            <Media fill imgClassName="object-cover" resource={product.gallery?.[0]?.image} />
          </div>

          <div className="flex flex-col gap-1 pr-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <h4 className="text-sm line-clamp-1" tabIndex={0}>
                    {product.title}
                  </h4>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>{product.title}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {product.priceInPKR != null && (
              <Price amount={product.priceInPKR} className="text-xs" />
            )}
          </div>
        </div>

        <Suspense fallback={null}>
          <div>
            <AddToCart product={product} showQuantity={false} buttonVariant="secondary" />
          </div>
        </Suspense>
      </div>
    </motion.div>
  )
}
