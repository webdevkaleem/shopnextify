import { ForgotPasswordForm } from '@/components/forms/ForgotPasswordForm'
import { Media } from '@/components/Media'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function ForgotPasswordContent() {
  const payload = await getPayload({ config: configPromise })
  const forgotPassword = await payload.findGlobal({ slug: 'forgotPassword', depth: 1 })

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Left Panel - Image */}
      <div className="w-1/2 relative overflow-hidden hidden md:block">
        {forgotPassword?.sideMedia && (
          <Media
            resource={forgotPassword.sideMedia}
            className=""
            alt="Forgot Password"
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
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  )
}
