import { adminOnly } from '@/access/adminOnly'
import {
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import type { Field, GlobalConfig } from 'payload'

export const StoreCardsOnProductDescriptionField: Field = {
  type: 'collapsible',
  label: 'Store Cards on Product Description',
  admin: {
    initCollapsed: true,
  },
  fields: [
    {
      name: 'storeCards',
      type: 'array',
      minRows: 0,
      maxRows: 10,
      fields: [
        {
          name: 'card',
          type: 'text',
          required: true,
          label: 'Card Title',
        },
      ],
    },
  ],
}

export const StoreDeliveryAndReturnsPolicyField: Field = {
  type: 'collapsible',
  label: 'Store Delivery and Returns Policy',
  admin: {
    initCollapsed: true,
  },
  fields: [
    {
      name: 'deliveryAndReturnsPolicy',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
            HorizontalRuleFeature(),
          ]
        },
      }),
      label: 'Delivery and Returns Policy',
    },
  ],
}

export const Store: GlobalConfig = {
  slug: 'store',
  admin: {
    group: 'Settings',
  },
  access: {
    read: () => true,
    update: adminOnly,
  },
  fields: [
    {
      name: 'storeName',
      type: 'text',
      required: true,
      label: 'Store Name',
    },
    StoreCardsOnProductDescriptionField,
    StoreDeliveryAndReturnsPolicyField,
  ],
}
