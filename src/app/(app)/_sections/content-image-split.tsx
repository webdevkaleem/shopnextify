import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import config from '@payload-config'
import * as motion from 'motion/react-client'
import { getPayload } from 'payload'
import { JSX } from 'react'

export default async function ContentImageSplit(): Promise<JSX.Element> {
  const payload = await getPayload({ config })

  const mainGlobal = await payload.findGlobal({ slug: 'main', depth: 1 })

  const contentImageSplitTitle = mainGlobal?.contentImageSplitTitle
  const contentImageSplitContent = mainGlobal?.contentImageSplitContent
  const contentImageSplitButton = mainGlobal?.contentImageSplitButton
  const contentImageSplitImage = mainGlobal?.contentImageSplitImage

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ margin: '-248px' }}
      className="flex w-full flex-col md:flex-row py-20"
    >
      <div className="relative w-full md:w-1/2 h-screen">
        <Media
          fill
          imgClassName="object-cover object-[50%_0%]"
          priority
          resource={contentImageSplitImage}
        />
      </div>

      <div className="w-full md:w-1/2 flex flex-col text-center items-center justify-center p-16 gap-6">
        <h2 className="text-4xl font-light">{contentImageSplitTitle}</h2>
        <p>{contentImageSplitContent}</p>
        {contentImageSplitButton?.link && (
          <CMSLink {...contentImageSplitButton.link} appearance={'outlineSecondaryInverse'}>
            {contentImageSplitButton.text}
          </CMSLink>
        )}
      </div>
    </motion.div>
  )
}
