import { Loader2 } from 'lucide-react'
import { Suspense, type ReactNode } from 'react'

type PageSuspenseProps = {
  children: ReactNode
}

/**
 * Suspense boundary wrapper for page content.
 * This component differentiates between dynamic and static server components
 * by wrapping async content in Suspense, allowing the page shell to be static
 * while the dynamic content streams in.
 */
export function PageSuspense({ children }: PageSuspenseProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] w-full flex items-center justify-center">
          <Loader2 className="size-6 animate-spin" />
        </div>
      }
    >
      {children}
    </Suspense>
  )
}
