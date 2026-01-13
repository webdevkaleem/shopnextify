import type { Metadata } from 'next'

import { PageSuspense } from '@/components/PageSuspense'
import { CreateAccountContent } from './_components/CreateAccountContent'

export default function CreateAccount() {
  return (
    <PageSuspense>
      <CreateAccountContent />
    </PageSuspense>
  )
}

export const metadata: Metadata = {
  description: 'Create an account or log in to your existing account.',
  openGraph: {
    title: 'Create Account',
    url: '/create-account',
  },
  title: 'Create Account',
}
