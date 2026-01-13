import type { Page } from '@/payload-types'
import config from '@payload-config'
import { getPayload } from 'payload'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { JSX } from 'react'
import CollectionGallery from '../_sections/collection-gallery'
import ContentImageSplit from '../_sections/content-image-split'
import JustArrived from '../_sections/just-arrived'

export async function HomeContent(): Promise<JSX.Element> {
  const payload = await getPayload({ config })

  const main = await payload.findGlobal({ slug: 'main', depth: 1 })

  // Derive url and newTab from link field
  const link = main?.link as
    | {
        type?: 'custom' | 'reference' | 'internalCustom'
        url?: string | null
        newTab?: boolean | null
        reference?: unknown
      }
    | undefined

  let linkUrl: string | null = null
  let linkNewTab: boolean = false
  let linkType: 'custom' | 'reference' | 'internalCustom' | null = null
  let linkReference: {
    relationTo: 'pages'
    value: Page | string
  } | null = null

  if (link) {
    linkType = link.type || null

    if (link.type === 'custom') {
      linkUrl = link.url || null
      linkNewTab = link.newTab ?? true // Default to true for custom (external)
    } else if (link.type === 'internalCustom') {
      linkUrl = link.url ? link.url.replace(/^\/+/, '') : null
      linkNewTab = link.newTab ?? false // Default to false for internalCustom
    } else if (link.type === 'reference' && link.reference) {
      // link.reference from Payload is already structured as { relationTo: 'pages', value: Page | string }
      // Use it directly to avoid double-nesting
      linkReference = link.reference as {
        relationTo: 'pages'
        value: Page | string
      }
      linkNewTab = link.newTab ?? false
    }
  }

  return (
    <>
      <div className="-mt-16 text-stone-100 relative min-h-screen flex md:items-end items-center justify-center text-center">
        {main?.heroMedia && typeof main.heroMedia === 'object' && (
          <Media
            fill
            imgClassName="object-cover object-[50%_20%]"
            priority
            resource={main.heroMedia}
          />
        )}

        <div className="flex flex-col gap-8 z-20 md:py-16 items-center justify-center">
          <p className="text-sm tracking-wide">{main?.heroContent}</p>
          <h1 className="text-6xl tracking-wide font-light">{main?.heroTitle}</h1>
          {link && (
            <CMSLink
              type={linkType}
              url={linkUrl}
              newTab={linkNewTab}
              reference={linkReference}
              appearance={'outline'}
              className="transition-all duration-300 w-fit hover:bg-foreground hover:text-background dark:hover:text-background"
            >
              {main?.heroLinkText}
            </CMSLink>
          )}
        </div>
      </div>
      <JustArrived />
      <CollectionGallery />
      <ContentImageSplit />
    </>
  )
}
