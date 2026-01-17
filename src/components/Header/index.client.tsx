'use client'
import { Cart } from '@/components/Cart'
import { OpenCartButton } from '@/components/Cart/OpenCart'
import { CMSLink } from '@/components/Link'
import { Suspense, useEffect, useState } from 'react'

import type { Header, Store, User as UserType } from 'src/payload-types'
import { MobileMenu } from './MobileMenu'

import { cn } from '@/utilities/cn'
import { User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { buttonVariants } from '../ui/button'
import SearchMenu from './SearchMenu'

type Props = {
  header: Header
  store: Store
  userObj: UserType | null
}

export function HeaderClient({ header, store, userObj }: Props) {
  const menu = header.navItems || []
  const pathname = usePathname()

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

  return (
    <div
      className={cn(
        'sticky top-0 right-0 z-50 border-b h-16 transition-all duration-300 flex items-center text-background dark:text-foreground',
        { 'bg-transparent': pathname === '/' },
        { 'bg-foreground dark:text-background': pathname !== '/' },
        {
          'bg-foreground dark:text-background': scrollY > 0,
        },
      )}
    >
      <nav className="flex items-center justify-between container">
        <div className="block flex-none md:hidden">
          <Suspense fallback={null}>
            <MobileMenu menu={menu} store={store} />
          </Suspense>
        </div>
        <div className="flex w-full items-center justify-between">
          <div className="w-full items-end gap-6 md:w-1/3 hidden md:flex">
            {menu.length ? (
              <ul className="hidden gap-4 text-sm md:flex md:items-center">
                {menu.map((item) => {
                  return (
                    <li key={item.id}>
                      <CMSLink
                        url={
                          item.link.type === 'internalCustom' ? item.link.url : `/${item.link.url}`
                        }
                        {...item.link}
                        size={'clear'}
                        className={cn(
                          'relative p-0 text-background',
                          { 'text-background dark:text-foreground': pathname === '/' },
                          {
                            active:
                              item.link.url && item.link.url !== '/'
                                ? pathname.includes(item.link.url)
                                : false,
                          },
                          scrollY > 0 &&
                            'text-background hover:text-background/50 dark:text-background',
                        )}
                        appearance="fade"
                      />
                    </li>
                  )
                })}
              </ul>
            ) : null}
          </div>
          <p className="text-3xl w-full text-left md:text-center md:w-fit px-4 md:px-0">
            {store.storeName}
          </p>
          <div className="flex justify-end md:w-1/3 gap-6 items-center">
            <SearchMenu />
            <div className="hidden sm:flex items-center justify-center">
              <Link
                href={userObj ? '/account' : '/login'}
                className={buttonVariants({
                  variant: 'fade',
                  size: 'clear',
                })}
              >
                <User className="size-6 text-current" />
              </Link>
            </div>
            <Suspense fallback={<OpenCartButton />}>
              <Cart />
            </Suspense>
          </div>
        </div>
      </nav>
    </div>
  )
}
