import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { Button } from '@/components/ui/button'
import config from '@payload-config'
import * as motion from 'motion/react-client'
import Link from 'next/link'
import { getPayload } from 'payload'
import { JSX } from 'react'

export default async function CollectionGallery(): Promise<JSX.Element> {
  const payload = await getPayload({ config })

  const collectionGallery = await payload.findGlobal({ slug: 'main', depth: 1 })

  const topLeftSection = collectionGallery?.topLeftSection
  const topRightSection = collectionGallery?.topRightSection
  const bottomSection = collectionGallery?.bottomSection

  // Helper function to normalize internal custom URLs
  const normalizeInternalUrl = (url: string | null | undefined): string | null => {
    if (!url) return null
    const normalized = url.replace(/^\/+/, '')
    // If result is empty string (was just '/'), return '/' for root path
    return normalized === '' ? '/' : normalized
  }

  // Helper function to compute href from link configuration
  const computeHref = (
    link:
      | {
          type?: 'custom' | 'reference' | 'internalCustom' | null
          url?: string | null
          reference?: {
            relationTo?: 'pages' | 'posts'
            value?: { slug?: string } | string | number
          } | null
        }
      | null
      | undefined,
  ): string | null => {
    if (!link) return null

    if (link.type === 'reference' && link.reference) {
      const { relationTo, value } = link.reference
      if (typeof value === 'object' && value?.slug) {
        return `${relationTo !== 'pages' ? `/${relationTo}` : ''}/${value.slug}`
      }
      return null
    }

    if (link.type === 'internalCustom' && link.url) {
      const normalized = normalizeInternalUrl(link.url)
      // Ensure leading slash for internal custom URLs (matching CMSLink behavior)
      return normalized ? (normalized.startsWith('/') ? normalized : `/${normalized}`) : null
    }

    if (link.type === 'custom' && link.url) {
      return link.url
    }

    return null
  }

  // Compute hrefs for all sections
  const topLeftHref = computeHref(topLeftSection?.link)
  const topRightHref = computeHref(topRightSection?.link)
  const bottomHref = computeHref(bottomSection?.link)

  // Helper to get newTab prop
  const getNewTabProps = (
    link:
      | {
          type?: 'custom' | 'reference' | 'internalCustom' | null
          newTab?: boolean | null
        }
      | null
      | undefined,
  ) => {
    if (!link) return {}
    const shouldOpenNewTab = link.type === 'custom' ? (link.newTab ?? true) : (link.newTab ?? false)
    return shouldOpenNewTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ margin: '-124px' }}
    >
      <div className="flex flex-col">
        <div className="flex flex-col md:flex-row">
          {/* Top left section */}
          {topLeftHref ? (
            <Link
              href={topLeftHref}
              className="group relative w-full md:w-1/2 h-[75vh] min-h-52 overflow-hidden block cursor-pointer"
              {...getNewTabProps(topLeftSection?.link)}
            >
              {topLeftSection?.media && typeof topLeftSection.media === 'object' && (
                <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-105">
                  <Media
                    fill
                    imgClassName="object-cover"
                    priority
                    resource={topLeftSection.media}
                  />
                </div>
              )}

              {/* Text overlay */}
              <div className="absolute inset-0 flex flex-col justify-center items-center z-10 pointer-events-none">
                {/* Title */}
                {topLeftSection?.title && (
                  <h2 className="text-white text-center text-4xl mb-6 leading-tight font-light tracking-wide">
                    {topLeftSection.title}
                  </h2>
                )}

                {/* Button/Link - rendered as styled button since section is already a link */}
                {topLeftSection?.link && topLeftSection?.buttonText && (
                  <div className="mt-4 relative pointer-events-auto">
                    <Button
                      variant={topLeftSection.styling === 'link' ? 'link' : 'outline'}
                      className="text-white"
                      asChild={false}
                    >
                      {topLeftSection.buttonText}
                    </Button>
                  </div>
                )}
              </div>
            </Link>
          ) : (
            <div className="group relative w-full md:w-1/2 h-[75vh] min-h-52 overflow-hidden">
              {topLeftSection?.media && typeof topLeftSection.media === 'object' && (
                <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-105">
                  <Media
                    fill
                    imgClassName="object-cover"
                    priority
                    resource={topLeftSection.media}
                  />
                </div>
              )}

              {/* Text overlay */}
              <div className="absolute inset-0 flex flex-col justify-center items-center z-10">
                {/* Title */}
                {topLeftSection?.title && (
                  <h2 className="text-white text-center text-4xl mb-6 leading-tight font-light tracking-wide">
                    {topLeftSection.title}
                  </h2>
                )}

                {/* Button/Link */}
                {topLeftSection?.link && topLeftSection?.buttonText && (
                  <div className="mt-4 relative">
                    <CMSLink
                      type={topLeftSection.link.type ?? null}
                      url={topLeftSection.link.url ?? null}
                      newTab={
                        topLeftSection.link.type === 'custom'
                          ? (topLeftSection.link.newTab ?? true)
                          : (topLeftSection.link.newTab ?? false)
                      }
                      reference={topLeftSection.link.reference ?? null}
                      appearance={topLeftSection.styling === 'link' ? 'link' : 'outline'}
                      className="text-white"
                    >
                      {topLeftSection.buttonText}
                    </CMSLink>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Top right section */}
          {topRightHref ? (
            <Link
              href={topRightHref}
              className="group relative w-full md:w-1/2 h-[75vh] min-h-52 overflow-hidden block cursor-pointer"
              {...getNewTabProps(topRightSection?.link)}
            >
              {topRightSection?.media && typeof topRightSection.media === 'object' && (
                <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-105">
                  <Media
                    fill
                    imgClassName="object-cover"
                    priority
                    resource={topRightSection.media}
                  />
                </div>
              )}
            </Link>
          ) : (
            <div className="group relative w-full md:w-1/2 h-[75vh] min-h-52 overflow-hidden">
              {topRightSection?.media && typeof topRightSection.media === 'object' && (
                <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-105">
                  <Media
                    fill
                    imgClassName="object-cover"
                    priority
                    resource={topRightSection.media}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom section */}
        {bottomHref ? (
          <Link
            href={bottomHref}
            className="group relative w-full h-[75vh] min-h-52 overflow-hidden block cursor-pointer"
            {...getNewTabProps(bottomSection?.link)}
          >
            {bottomSection?.media && typeof bottomSection.media === 'object' && (
              <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-105">
                <Media fill imgClassName="object-cover" priority resource={bottomSection.media} />
              </div>
            )}

            {/* Text overlay */}
            <div className="absolute inset-0 flex flex-col justify-center items-center z-10 pointer-events-none">
              {/* Title */}
              {bottomSection?.title && (
                <h2 className="text-white px-6 text-center text-4xl mb-6 leading-tight font-light tracking-wide">
                  {bottomSection.title}
                </h2>
              )}

              {/* Button/Link - rendered as styled button since section is already a link */}
              {bottomSection?.link && bottomSection?.buttonText && (
                <div className="mt-4 relative pointer-events-auto">
                  <Button
                    variant={bottomSection.styling === 'link' ? 'link' : 'outline'}
                    className="text-white p-6 rounded-full hover:bg-foreground hover:text-background dark:hover:text-background"
                    asChild={false}
                  >
                    {bottomSection.buttonText}
                  </Button>
                </div>
              )}
            </div>
          </Link>
        ) : (
          <div className="group relative w-full h-[75vh] min-h-52 overflow-hidden">
            {bottomSection?.media && typeof bottomSection.media === 'object' && (
              <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-105">
                <Media fill imgClassName="object-cover" priority resource={bottomSection.media} />
              </div>
            )}

            {/* Text overlay */}
            <div className="absolute inset-0 flex flex-col justify-center items-center z-10">
              {/* Title */}
              {bottomSection?.title && (
                <h2 className="text-white px-6 text-center text-4xl mb-6 leading-tight font-light tracking-wide">
                  {bottomSection.title}
                </h2>
              )}

              {/* Button/Link */}
              {bottomSection?.link && bottomSection?.buttonText && (
                <div className="mt-4 relative">
                  <CMSLink
                    type={bottomSection.link.type ?? null}
                    url={bottomSection.link.url ?? null}
                    newTab={
                      bottomSection.link.type === 'custom'
                        ? (bottomSection.link.newTab ?? true)
                        : (bottomSection.link.newTab ?? false)
                    }
                    reference={bottomSection.link.reference ?? null}
                    appearance={bottomSection.styling === 'link' ? 'link' : 'outline'}
                    className="text-white p-6 rounded-full hover:bg-foreground hover:text-background dark:hover:text-background"
                  >
                    {bottomSection.buttonText}
                  </CMSLink>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
