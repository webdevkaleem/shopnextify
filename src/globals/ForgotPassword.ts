import type { GlobalConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'

export const ForgotPassword: GlobalConfig = {
  slug: 'forgotPassword',
  admin: {
    group: 'Settings',
    livePreview: {
      url: () => '/forgot-password',
    },
    preview: () => '/forgot-password',
  },
  access: {
    read: () => true,
    update: adminOnly,
  },
  fields: [
    {
      name: 'sideMedia',
      type: 'upload',
      relationTo: 'media',
      label: 'Side Media',
    },
  ],
}
