'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { sorting } from '@/lib/constants'
import { createUrl } from '@/utilities/createUrl'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export function SortSelect() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const urlSort = searchParams.get('sort')
  // Map null/undefined to 'title' for default sort, or use the URL sort value
  const currentSort = urlSort || 'title'

  const handleValueChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams.toString())

    if (value === 'title') {
      // Remove sort param for default sort (title)
      newParams.delete('sort')
    } else {
      newParams.set('sort', value)
    }

    router.push(createUrl(pathname, newParams))
  }

  // Find the current sort option title to display
  const currentSortTitle =
    sorting.find((item) => (item.slug || 'title') === currentSort)?.title || sorting[0].title

  return (
    <div className="flex items-center gap-2 w-full">
      <Select value={currentSort} onValueChange={handleValueChange}>
        <SelectTrigger id="sort-select" className="w-full m-0">
          <SelectValue>{currentSortTitle}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {sorting.map((item) => {
            const value = item.slug || 'title'
            return (
              <SelectItem key={value} value={value}>
                {item.title}
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
    </div>
  )
}
