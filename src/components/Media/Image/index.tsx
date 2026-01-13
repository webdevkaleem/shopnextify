'use client'

import { cn } from '@/utilities/cn'
import NextImage from 'next/image'
import React from 'react'

import type { Props as MediaProps } from '../types'

export const Image: React.FC<MediaProps> = (props) => {
  const {
    alt: altFromProps,
    fill,
    height: heightFromProps,
    imgClassName,
    onClick,
    onLoad: onLoadFromProps,
    priority,
    resource,
    size: sizeFromProps,
    src: srcFromProps,
    style: styleFromProps,
    width: widthFromProps,
  } = props

  const [imageLoaded, setImageLoaded] = React.useState(false)

  // Calculate image data synchronously to prevent content shift
  const imageData = React.useMemo(() => {
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || ''

    const normalizeUrl = (urlPath: string | null | undefined): string | null => {
      if (!urlPath || urlPath.trim() === '') return null

      // If already absolute URL, return as-is
      if (urlPath.startsWith('http://') || urlPath.startsWith('https://')) {
        return urlPath
      }

      // If baseUrl is empty, use relative path if it starts with /
      if (!baseUrl || baseUrl.trim() === '') {
        return urlPath.startsWith('/') ? urlPath : null
      }

      // Ensure urlPath starts with / if it's a relative path
      const normalizedPath = urlPath.startsWith('/') ? urlPath : `/${urlPath}`
      const cleanBaseUrl = baseUrl.replace(/\/$/, '')

      return `${cleanBaseUrl}${normalizedPath}`
    }

    if (srcFromProps) {
      // Static image provided
      const src = typeof srcFromProps === 'string' ? srcFromProps : srcFromProps.src
      const normalizedSrc = normalizeUrl(src)
      if (!normalizedSrc) return null

      return {
        src: normalizedSrc,
        alt: altFromProps || '',
        width: widthFromProps || null,
        height: heightFromProps || null,
      }
    }

    if (!resource || typeof resource !== 'object') {
      return null
    }

    const { alt: altFromResource, height: fullHeight, url, width: fullWidth } = resource

    // Use original URL - Next.js Image will handle optimization and caching
    const originalUrl = normalizeUrl(url)
    if (!originalUrl || originalUrl === '') {
      return null
    }

    return {
      src: originalUrl,
      alt: altFromResource || altFromProps || '',
      width: widthFromProps ?? fullWidth ?? null,
      height: heightFromProps ?? fullHeight ?? null,
    }
  }, [resource, widthFromProps, heightFromProps, altFromProps, srcFromProps])

  // Handle image load
  const handleImageLoad = React.useCallback(() => {
    setImageLoaded(true)
    if (onLoadFromProps) {
      onLoadFromProps()
    }
  }, [onLoadFromProps])

  // Base styles
  const baseFillStyle: React.CSSProperties = fill
    ? {
        objectFit: 'cover',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }
    : {}

  const imageStyle: React.CSSProperties = {
    ...baseFillStyle,
    ...(styleFromProps as React.CSSProperties),
  }

  // Determine dimensions for placeholder and container
  const finalWidth = imageData?.width || widthFromProps || null
  const finalHeight = imageData?.height || heightFromProps || null

  // Calculate aspect ratio to prevent layout shift
  // Default to 3:2 aspect ratio if dimensions aren't available
  const aspectRatio = finalWidth != null && finalHeight != null ? finalWidth / finalHeight : 3 / 2 // Default 3:2 aspect ratio

  // Container style - must match exactly between placeholder and image to prevent shift
  const containerStyle: React.CSSProperties = fill
    ? {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }
    : {
        width: '100%',
        height: 'auto',
        aspectRatio:
          finalWidth != null && finalHeight != null ? `${finalWidth} / ${finalHeight}` : '3 / 2', // Default 3:2 aspect ratio
        backgroundColor: 'rgba(0, 0, 0, 0.02)',
      }

  if (!imageData || !imageData.src) {
    // Show placeholder with exact same dimensions to prevent layout shift
    return (
      <div style={containerStyle} className={cn(imgClassName)} aria-hidden="true">
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
          }}
        />
      </div>
    )
  }

  // Render image - Next.js Image handles optimization and caching
  return (
    <div style={containerStyle} className={fill ? undefined : cn(imgClassName)}>
      <NextImage
        alt={imageData.alt}
        className={cn(imgClassName)}
        fill={fill}
        {...(!fill && {
          height: finalHeight != null ? finalHeight : undefined,
          width: finalWidth != null ? finalWidth : undefined,
        })}
        onClick={onClick}
        onLoad={handleImageLoad}
        priority={priority}
        quality={90}
        sizes={sizeFromProps || '100vw'}
        src={imageData.src}
        style={imageStyle}
      />
    </div>
  )
}
