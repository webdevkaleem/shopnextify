import type { Field, GlobalConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'
import { link } from '@/fields/link'

export const HeroSectionCollapsibleField: Field = {
  type: 'collapsible',
  label: 'Hero Section',
  admin: {
    initCollapsed: false,
  },
  fields: [
    {
      name: 'heroContent',
      type: 'text',
      required: true,
      label: 'Hero Content',
    },
    {
      name: 'heroTitle',
      type: 'text',
      required: true,
      label: 'Hero Title',
    },
    {
      name: 'heroLinkText',
      type: 'text',
      required: true,
      label: 'Hero Link Text',
    },
    link({
      disableLabel: true,
      appearances: false,
    }),
    {
      name: 'heroMedia',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Hero Media',
    },
  ],
}

export const CollectionGalleryFieldSectionItems: Field[] = [
  {
    name: 'title',
    type: 'text',
    label: 'Title',
  },
  {
    name: 'titleItalic',
    type: 'text',
    label: 'Title Italic (Chunk of text you want to be italic)',
  },
  {
    name: 'buttonText',
    type: 'text',
    label: 'Button Text',
  },
  link({
    disableLabel: true,
    appearances: false,
    overrides: {
      required: false,
    },
  }),
  {
    name: 'styling',
    label: 'Styling',
    type: 'radio',
    defaultValue: 'button',
    options: [
      {
        label: 'Link',
        value: 'link',
      },
      {
        label: 'Button',
        value: 'button',
      },
    ],
  },
  {
    name: 'media',
    type: 'upload',
    relationTo: 'media',
    label: 'Media',
    required: true,
  },
]

export const CollectionGalleryCollapsibleField: Field = {
  type: 'collapsible',
  label: 'Collection Gallery',
  admin: {
    initCollapsed: true,
  },
  fields: [
    {
      name: 'topLeftSection',
      label: 'Top Left Section',
      type: 'group',
      required: true,
      fields: CollectionGalleryFieldSectionItems,
    },
    {
      name: 'topRightSection',
      label: 'Top Right Section',
      type: 'group',
      required: true,
      fields: CollectionGalleryFieldSectionItems,
    },
    {
      name: 'bottomSection',
      label: 'Bottom Section',
      type: 'group',
      required: true,
      fields: CollectionGalleryFieldSectionItems,
    },
  ],
}

export const ContentImageSplitCollapsibleField: Field = {
  type: 'collapsible',
  label: 'Content Image Split',
  admin: {
    initCollapsed: true,
  },
  fields: [
    {
      name: 'contentImageSplitTitle',
      type: 'text',
      required: true,
      label: 'Title',
    },
    {
      name: 'contentImageSplitContent',
      type: 'text',
      required: true,
      label: 'Content',
    },
    {
      name: 'contentImageSplitButton',
      type: 'group',
      required: true,
      label: 'Button',
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
          label: 'Text',
        },
        link({
          disableLabel: true,
          appearances: false,
        }),
      ],
    },
    {
      name: 'contentImageSplitImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Image',
    },
  ],
}

export const Main: GlobalConfig = {
  slug: 'main',
  admin: {
    group: 'Settings',
    livePreview: {
      url: ({ data, req }) => '/',
    },
    preview: (data, { req }) => '/',
  },
  access: {
    read: () => true,
    update: adminOnly,
  },
  fields: [
    HeroSectionCollapsibleField,
    CollectionGalleryCollapsibleField,
    ContentImageSplitCollapsibleField,
  ],
}
