'use client'

import type { Header, Store } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useAuth } from '@/providers/Auth'
import { cn } from '@/utilities/cn'
import { MenuIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Props {
  menu: Header['navItems']
  store: Store
}

export function MobileMenu({ menu, store }: Props) {
  const { user } = useAuth()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)

  const closeMobileMenu = () => setIsOpen(false)

  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isOpen])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname, searchParams])

  return (
    <Sheet onOpenChange={setIsOpen} open={isOpen}>
      <SheetTrigger
        className={cn(
          'relative flex h-11 w-11 items-center justify-center rounded-md border border-background dark:border-foreground text-background dark:text-foreground transition-colors',
          {
            'border-background dark:border-background': pathname !== '/',
          },
          {
            'border-background dark:border-background': scrollY > 0 && pathname === '/',
          },
        )}
      >
        <MenuIcon
          className={cn(
            'h-4 text-background dark:text-foreground',
            {
              'dark:text-background': pathname !== '/',
            },
            {
              'dark:text-background': pathname === '/' && scrollY > 0,
            },
          )}
        />
      </SheetTrigger>

      <SheetContent side="left" className="flex flex-col p-4 overflow-hidden">
        <SheetHeader className="p-0 shrink-0">
          <SheetTitle>{store.storeName}</SheetTitle>

          <SheetDescription />
        </SheetHeader>

        <div className="mobile-menu-scrollable flex-1 min-h-[120px] overflow-y-auto">
          {menu?.length ? (
            <ul className="flex w-full flex-col">
              {menu.map((item) => (
                <li className="py-2" key={item.id}>
                  <CMSLink {...item.link} appearance="link" />
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-muted-foreground text-sm">No menu items</div>
          )}
        </div>

        {user ? (
          <div className="flex flex-col shrink-0">
            <h2 className="text-xl mb-4">Your account</h2>
            <hr className="my-2" />
            <ul className="flex flex-col gap-2">
              <li>
                <Link href="/orders">Orders</Link>
              </li>
              <li>
                <Link href="/account/addresses">Addresses</Link>
              </li>
              <li>
                <Link href="/account">Manage account</Link>
              </li>
              <li className="mt-6">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/logout">Log out</Link>
                </Button>
              </li>
            </ul>
          </div>
        ) : (
          <div className="flex flex-col shrink-0">
            <div className="flex items-center flex-col gap-2 mt-4">
              <Button asChild className="w-full" variant="outline">
                <Link href="/login">Log in</Link>
              </Button>
              <span>or</span>
              <Button asChild className="w-full">
                <Link href="/create-account">Create an account</Link>
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
