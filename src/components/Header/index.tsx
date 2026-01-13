import config from '@payload-config'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import { HeaderClient } from './index.client'

import './index.css'

export async function Header() {
  const payload = await getPayload({ config })

  const header = await payload.findGlobal({ slug: 'header', depth: 1 })
  const store = await payload.findGlobal({ slug: 'store', depth: 1 })

  const headers = await getHeaders()
  const { user } = await payload.auth({ headers })

  return <HeaderClient header={header} store={store} userObj={user} />
}
