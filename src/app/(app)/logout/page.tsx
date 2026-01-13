import type { Metadata } from 'next'

import { PageSuspense } from '@/components/PageSuspense'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { LogoutContent } from './_components/LogoutContent'

export default function Logout() {
  return (
    <div className="container max-w-lg my-16">
      <PageSuspense>
        <LogoutContent />
      </PageSuspense>
    </div>
  )
}

export const metadata: Metadata = {
  description: 'You have been logged out.',
  openGraph: mergeOpenGraph({
    title: 'Logout',
    url: '/logout',
  }),
  title: 'Logout',
}
