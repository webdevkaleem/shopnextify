'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { cn } from '@/utilities/cn'
import { Info } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'

export type Props = {
  className?: string
  message?: string
  onParams?: (paramValues: ((null | string | undefined) | string[])[]) => void
  params?: string[]
}

export const RenderParamsComponent: React.FC<Props> = ({
  className,
  onParams,
  params = ['error', 'warning', 'success', 'message'],
}) => {
  const searchParams = useSearchParams()
  const paramValues = params.map((param) => searchParams?.get(param))

  useEffect(() => {
    if (paramValues.length && onParams) {
      onParams(paramValues)
    }
  }, [paramValues, onParams])

  if (paramValues.length) {
    return (
      <div className={className}>
        {paramValues.map((paramValue, index) => {
          if (!paramValue) return null

          return (
            <Alert variant="default" className={cn(className, 'pt-8')} key={paramValue}>
              <AlertDescription>
                <div className="flex gap-4 items-center">
                  <Info />
                  {paramValue}
                </div>
              </AlertDescription>
            </Alert>
          )
        })}
      </div>
    )
  }

  return null
}
