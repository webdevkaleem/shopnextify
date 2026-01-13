import type { GlobalConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'

export const CreateAccount: GlobalConfig = {
  slug: 'createAccount',
  admin: {
    group: 'Settings',
    livePreview: {
      url: () => '/create-account',
    },
    preview: () => '/create-account',
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
