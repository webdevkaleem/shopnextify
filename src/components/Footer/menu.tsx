import type { Footer } from '@/payload-types'

import { CMSLink } from '@/components/Link'

interface Props {
  navGroups: Footer['navGroups']
}

export function FooterMenu({ navGroups }: Props) {
  if (!navGroups?.length) return null

  return (
    <nav className="flex flex-col gap-6 md:flex-row md:gap-12 flex-wrap">
      {navGroups.map((group) => {
        if (!group.navItems?.length) return null

        return (
          <div key={group.id} className="flex flex-col gap-2">
            <p className="opacity-75 tracking-wider">{group.groupName}</p>
            <ul className="flex flex-col gap-2">
              {group.navItems.map((item) => {
                return (
                  <li key={item.id}>
                    <CMSLink appearance="link" {...item.link} />
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
    </nav>
  )
}
