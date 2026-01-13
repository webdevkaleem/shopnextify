import type { Metadata } from 'next'

import { PageSuspense } from '@/components/PageSuspense'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { HomeContent } from './_components/HomeContent'

export const metadata: Metadata = {
  description: 'Welcome to our online store. Discover our latest products and collections.',
  openGraph: mergeOpenGraph({
    title: 'Home',
    url: '/',
  }),
  title: 'Home',
}

export default function Home() {
  return (
    <PageSuspense>
      <HomeContent />
    </PageSuspense>
  )
}
