'use client'

import { RichText } from '@/components/RichText'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import type { Product, Store } from '@/payload-types'
import { Minus, Plus } from 'lucide-react'
import { useState } from 'react'

export function MoreInformation({
  product,
  storeDeliveryAndReturnsPolicy,
}: {
  product: Product
  storeDeliveryAndReturnsPolicy: Store['deliveryAndReturnsPolicy'] | undefined
}) {
  return (
    <div className="container flex flex-col gap-4">
      <h2 className="text-4xl font-light">More Info</h2>
      <Description product={product} defaultOpen={true} />
      <DeliveryAndReturnsPolicy
        storeDeliveryAndReturnsPolicy={storeDeliveryAndReturnsPolicy}
        defaultOpen={false}
      />
    </div>
  )
}

export function DeliveryAndReturnsPolicy({
  storeDeliveryAndReturnsPolicy,
  defaultOpen,
}: {
  storeDeliveryAndReturnsPolicy: Store['deliveryAndReturnsPolicy'] | undefined
  defaultOpen: boolean
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="py-8 border-b w-full">
        <div className="flex items-center justify-between w-full">
          <h4 className="text-xl font-light">Delivery and Returns Policy</h4>
          {isOpen ? <Minus className="size-4" /> : <Plus className="size-4" />}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-8">
        {storeDeliveryAndReturnsPolicy ? (
          <RichText data={storeDeliveryAndReturnsPolicy} enableGutter={false} />
        ) : null}
      </CollapsibleContent>
    </Collapsible>
  )
}

export function Description({ product, defaultOpen }: { product: Product; defaultOpen: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="py-8 border-b w-full">
        <div className="flex items-center justify-between w-full">
          <h4 className="text-xl font-light">Description</h4>
          {isOpen ? <Minus className="size-4" /> : <Plus className="size-4" />}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-8">
        {product.description ? <RichText data={product.description} enableGutter={false} /> : null}
      </CollapsibleContent>
    </Collapsible>
  )
}
