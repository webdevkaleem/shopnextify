'use client'

import { Button } from '@/components/ui/button'
import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Separator } from '../ui/separator'

type Props = {
  className?: string
}

export const AccountNav: React.FC<Props> = ({ className }) => {
  const pathname = usePathname()

  return (
    <div className={clsx(className)}>
      <ul className="flex flex-col">
        <li>
          <Button asChild variant="link" className="p-0">
            <Link
              href="/account"
              className={clsx(
                'text-primary/50 hover:text-primary hover:no-underline text-left pl-0',
                {
                  'text-primary': pathname === '/account',
                },
              )}
            >
              Account settings
            </Link>
          </Button>
        </li>

        <li>
          <Button asChild variant="link" className="p-0">
            <Link
              href="/account/addresses"
              className={clsx(
                'text-primary/50 hover:text-primary hover:no-underline text-left pl-0',
                {
                  'text-primary': pathname === '/account/addresses',
                },
              )}
            >
              Addresses
            </Link>
          </Button>
        </li>

        <li>
          <Button
            asChild
            variant="link"
            className={clsx('text-primary/50 hover:text-primary hover:no-underline text-left p-0', {
              'text-primary': pathname === '/orders' || pathname.includes('/orders'),
            })}
          >
            <Link href="/orders">Orders</Link>
          </Button>
        </li>
      </ul>

      <Separator />

      <Button asChild variant="default" className="w-full">
        <Link href="/logout">Log out</Link>
      </Button>
    </div>
  )
}
