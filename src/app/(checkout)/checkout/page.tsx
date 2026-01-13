import type { Metadata } from 'next'

import { PageSuspense } from '@/components/PageSuspense'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { CheckoutContent } from './_components/CheckoutContent'

export default function Checkout() {
  return (
    <div className="container min-h-[90vh] flex">
      <PageSuspense>
        <CheckoutContent />
      </PageSuspense>
    </div>
  )
}

export const metadata: Metadata = {
  description: 'Checkout.',
  openGraph: mergeOpenGraph({
    title: 'Checkout',
    url: '/checkout',
  }),
  title: 'Checkout',
}
