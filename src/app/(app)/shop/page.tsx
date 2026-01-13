import { PageSuspense } from '@/components/PageSuspense'
import { ShopContent } from './ShopContent'

export const metadata = {
  description: 'Search for products in the store.',
  title: 'Shop',
}

type SearchParams = { [key: string]: string | string[] | undefined }

type Props = {
  searchParams: Promise<SearchParams>
}

export default function ShopPage({ searchParams }: Props) {
  return (
    <PageSuspense>
      <ShopContent searchParams={searchParams} />
    </PageSuspense>
  )
}
