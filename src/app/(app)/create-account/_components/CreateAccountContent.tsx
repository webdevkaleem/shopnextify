import { CreateAccountForm } from '@/components/forms/CreateAccountForm'
import { Media } from '@/components/Media'
import configPromise from '@payload-config'
import { headers as getHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

export async function CreateAccountContent() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })
  const createAccount = await payload.findGlobal({ slug: 'createAccount' })

  if (user) {
    redirect(`/account?warning=${encodeURIComponent('You are already logged in.')}`)
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Left Panel - Image */}
      <div className="w-1/2 relative overflow-hidden hidden md:block">
        {createAccount?.sideMedia && (
          <Media
            resource={createAccount.sideMedia}
            className=""
            alt="Create Account"
            fill
            imgClassName="grayscale"
            priority
          />
        )}
      </div>

      {/* Right Panel - Form */}
      <div className="w-full md:w-1/2 bg-background flex items-center justify-center p-12">
        <div className="w-full max-w-md">
          <CreateAccountForm />
        </div>
      </div>
    </div>
  )
}
