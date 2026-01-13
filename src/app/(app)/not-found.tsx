import Link from 'next/link'

import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="container w-full text-center flex-col px-16 gap-6 h-[calc(100vh-4rem)] flex items-center justify-center">
      <h1 className="text-4xl font-light">Oops!</h1>
      <p className="text-sm opacity-75">
        We can&apos;t find what you&apos;re looking for here. Click below to go back to the
        homepage.
      </p>
      <Button asChild variant="outlineSecondaryInverse">
        <Link href="/">BACK HOME</Link>
      </Button>
    </div>
  )
}
