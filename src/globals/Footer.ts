import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navGroups',
      type: 'array',
      label: 'Navigation Groups',
      fields: [
        {
          name: 'groupName',
          type: 'text',
          label: 'Group Name',
          required: true,
          admin: {
            description: 'e.g., "Shop", "Support", "Company"',
          },
        },
        {
          name: 'navItems',
          type: 'array',
          label: 'Navigation Items',
          fields: [
            link({
              appearances: false,
            }),
          ],
        },
      ],
    },
  ],
}
