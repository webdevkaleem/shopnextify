import { FindOrderForm } from '@/components/forms/FindOrderForm'
import { Media } from '@/components/Media'
import configPromise from '@payload-config'
import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'

export async function FindOrderContent() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })
  const findOrder = await payload.findGlobal({ slug: 'findOrder', depth: 1 })

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Left Panel - Image */}
      <div className="w-1/2 relative overflow-hidden hidden md:block">
        {findOrder?.sideMedia && (
          <Media
            resource={findOrder.sideMedia}
            className=""
            alt="Find Order"
            fill
            imgClassName="grayscale"
            priority
            usePayloadSizes
          />
        )}
      </div>

      {/* Right Panel - Form */}
      <div className="w-full md:w-1/2 bg-background flex items-center justify-center p-12">
        <div className="w-full max-w-md">
          <FindOrderForm initialEmail={user?.email} />
        </div>
      </div>
    </div>
  )
}
