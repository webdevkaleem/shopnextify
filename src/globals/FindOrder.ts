import type { GlobalConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'

export const FindOrder: GlobalConfig = {
  slug: 'findOrder',
  admin: {
    group: 'Settings',
    livePreview: {
      url: () => '/find-order',
    },
    preview: () => '/find-order',
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
