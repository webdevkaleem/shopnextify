import type { Metadata } from 'next'

import { PageSuspense } from '@/components/PageSuspense'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { ForgotPasswordContent } from './_components/ForgotPasswordContent'

export default function ForgotPasswordPage() {
  return (
    <PageSuspense>
      <ForgotPasswordContent />
    </PageSuspense>
  )
}

export const metadata: Metadata = {
  description: 'Enter your email address to recover your password.',
  openGraph: mergeOpenGraph({
    title: 'Forgot Password',
    url: '/forgot-password',
  }),
  title: 'Forgot Password',
}
