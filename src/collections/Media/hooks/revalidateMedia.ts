import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath } from 'next/cache'

import type { Media } from '../../../payload-types'

export const revalidateMedia: CollectionAfterChangeHook<Media> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    // Revalidate the media file URL if it exists
    if (doc.url) {
      // Extract path from URL (handles both absolute and relative URLs)
      let mediaPath = doc.url

      // If it's an absolute URL, extract just the path
      try {
        const url = new URL(doc.url)
        mediaPath = url.pathname
      } catch {
        // If URL parsing fails, assume it's already a path
        // Ensure it starts with / if it's a relative path
        if (!mediaPath.startsWith('/')) {
          mediaPath = `/${mediaPath}`
        }
      }

      payload.logger.info(`Revalidating media at path: ${mediaPath}`)

      // Revalidate the direct media file path
      revalidatePath(mediaPath)

      // Also revalidate the Next.js optimized image path pattern
      // This ensures cached optimized images are invalidated
      revalidatePath('/_next/image', 'layout')
    }

    // If the media file was changed (different URL), revalidate the old path too
    if (previousDoc?.url && previousDoc.url !== doc.url) {
      let oldMediaPath = previousDoc.url

      try {
        const url = new URL(previousDoc.url)
        oldMediaPath = url.pathname
      } catch {
        if (!oldMediaPath.startsWith('/')) {
          oldMediaPath = `/${oldMediaPath}`
        }
      }

      payload.logger.info(`Revalidating old media at path: ${oldMediaPath}`)

      revalidatePath(oldMediaPath)
      revalidatePath('/_next/image', 'layout')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Media> = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate && doc?.url) {
    let mediaPath = doc.url

    try {
      const url = new URL(doc.url)
      mediaPath = url.pathname
    } catch {
      if (!mediaPath.startsWith('/')) {
        mediaPath = `/${mediaPath}`
      }
    }

    payload.logger.info(`Revalidating deleted media at path: ${mediaPath}`)

    revalidatePath(mediaPath)
    revalidatePath('/_next/image', 'layout')
  }

  return doc
}
