'use client'

import { Input } from '@/components/ui/input'
import { Button } from '../ui/button'

export default function Newsletter() {
  return (
    <div className="flex flex-col gap-2 md:w-96 md:min-w-96 w-full">
      <p className="opacity-75 tracking-wider">NEWSLETTER</p>
      <p>Sign up to receive 10% off your first order</p>

      <form className="w-full">
        <div className="flex w-full">
          <div className="flex items-center dark:bg-foreground dark:text-background overflow-hidden border border-border w-full">
            <Input
              type="email"
              placeholder="Email address"
              className="px-4 py-3 w-full rounded-none h-full bg-foreground text-background focus-visible:border-none focus-visible:ring-transparent focus-visible:ring-0"
              name="email"
              required
              disabled
            />
          </div>
          <Button type="submit" variant={'secondary'} className="rounded-none" disabled>
            SUBSCRIBE
          </Button>
        </div>
      </form>
    </div>
  )
}
