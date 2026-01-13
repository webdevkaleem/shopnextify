import type { ReactNode } from 'react'

import { AccountNav } from '@/components/AccountNav'
import { RenderParams } from '@/components/RenderParams'
import configPromise from '@payload-config'
import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'

export default async function RootLayout({ children }: { children: ReactNode }) {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  return (
    <div className="container mx-auto">
      <div>
        <RenderParams />
      </div>

      <div className="mt-16 pb-8 flex flex-col md:flex-row gap-8 items-start justify-between">
        {user && (
          <AccountNav className="w-full max-w-64 flex-col items-start gap-4 hidden md:flex md:sticky md:top-24 md:self-start" />
        )}

        <div className="flex flex-col gap-12 w-full max-w-3xl mx-auto">{children}</div>
      </div>
    </div>
  )
}
