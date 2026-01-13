import type { Metadata } from 'next'

import { PageSuspense } from '@/components/PageSuspense'
import { LoginContent } from './_components/LoginContent'

export default function Login() {
  return (
    <PageSuspense>
      <LoginContent />
    </PageSuspense>
  )
}

export const metadata: Metadata = {
  description: 'Login or create an account to get started.',
  openGraph: {
    title: 'Login',
    url: '/login',
  },
  title: 'Login',
}
