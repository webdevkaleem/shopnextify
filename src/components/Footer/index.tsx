import type { Footer } from '@/payload-types'

import { FooterMenu } from '@/components/Footer/menu'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import { Suspense } from 'react'
import Newsletter from './newsletter'

const { COMPANY_NAME, SITE_NAME } = process.env

export async function Footer() {
  const footer: Footer = await getCachedGlobal('footer', 1)()
  const navGroups = footer.navGroups || []
  const currentYear = new Date().getFullYear()
  const copyrightDate = 2023 + (currentYear > 2023 ? `-${currentYear}` : '')
  const skeleton = 'w-full h-6 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700'

  const copyrightName = COMPANY_NAME || SITE_NAME || ''

  return (
    <footer className="text-xs">
      <div className="container">
        <div className="flex w-full flex-col justify-between items-start gap-6 py-12 md:flex-row md:gap-12">
          <Newsletter />
          <Suspense
            fallback={
              <div className="flex h-[188px] w-[200px] flex-col gap-2">
                <div className={skeleton} />
                <div className={skeleton} />
                <div className={skeleton} />
                <div className={skeleton} />
                <div className={skeleton} />
                <div className={skeleton} />
              </div>
            }
          >
            <FooterMenu navGroups={navGroups} />
          </Suspense>
        </div>
      </div>
      <div className="container flex gap-4 justify-between items-center pb-12">
        <div className="flex flex-col text-sm gap-2">
          <h1 className="text-4xl font-light">{copyrightName}</h1>
          <p>
            Release is a premium official Shopify theme designed by DigiFist.{' '}
            <Link
              href="https://themes.shopify.com/themes/release/presets/release?surface_detail=clothing&surface_inter_position=1&surface_intra_position=5&surface_type=industry"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Learn more
            </Link>{' '}
            {' -  '} I don&apos;t own this theme. This is a demo site for a Shopify theme. Certain
            functionalities have been disabled to make it more suitable for a demo.
          </p>
        </div>

        <div className="">
          <ThemeSelector />
        </div>
      </div>
    </footer>
  )
}
