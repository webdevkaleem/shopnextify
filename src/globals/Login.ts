import type { GlobalConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'

export const Login: GlobalConfig = {
  slug: 'login',
  admin: {
    group: 'Settings',
    livePreview: {
      url: () => '/login',
    },
    preview: () => '/login',
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
