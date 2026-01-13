import type { Metadata } from 'next'

import { PageSuspense } from '@/components/PageSuspense'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { AddressesContent } from './_components/AddressesContent'

export default function AddressesPage() {
  return (
    <PageSuspense>
      <AddressesContent />
    </PageSuspense>
  )
}

export const metadata: Metadata = {
  description: 'Manage your addresses.',
  openGraph: mergeOpenGraph({
    title: 'Addresses',
    url: '/account/addresses',
  }),
  title: 'Addresses',
}
