'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { createUrl } from '@/utilities/createUrl'
import { ChevronUp } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

type FilterState = {
  priceFrom: string
  priceTo: string
  availability: string[]
}

const AVAILABILITY_OPTIONS = [
  { value: 'in_stock', label: 'IN STOCK' },
  { value: 'out_of_stock', label: 'OUT OF STOCK' },
]

export function FilterSelect() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)
  const [isPriceRangeOpen, setIsPriceRangeOpen] = useState(true)
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(true)

  // Initialize filter state from URL params
  const getInitialFilterState = (): FilterState => {
    return {
      priceFrom: searchParams.get('priceFrom') || '',
      priceTo: searchParams.get('priceTo') || '',
      availability: searchParams.get('availability')?.split(',').filter(Boolean) || [],
    }
  }

  const [filterState, setFilterState] = useState<FilterState>(getInitialFilterState())

  // Sync filter state when URL params change externally
  useEffect(() => {
    const newState = getInitialFilterState()
    setFilterState(newState)
  }, [searchParams])

  const handlePriceChange = (field: 'priceFrom' | 'priceTo', value: string) => {
    setFilterState((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAvailabilityToggle = (availabilityValue: string) => {
    setFilterState((prev) => {
      const isSelected = prev.availability.includes(availabilityValue)
      return {
        ...prev,
        availability: isSelected
          ? prev.availability.filter((a) => a !== availabilityValue)
          : [...prev.availability, availabilityValue],
      }
    })
  }

  const handleClearAll = () => {
    const clearedState = {
      priceFrom: '',
      priceTo: '',
      availability: [],
    }

    setFilterState(clearedState)

    // Update URL params to remove all filters
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.delete('priceFrom')
    newParams.delete('priceTo')
    newParams.delete('availability')

    router.push(createUrl(pathname, newParams))
    setIsOpen(false)
  }

  const handleApplyFilters = () => {
    const newParams = new URLSearchParams(searchParams.toString())

    // Price filters
    if (filterState.priceFrom) {
      newParams.set('priceFrom', filterState.priceFrom)
    } else {
      newParams.delete('priceFrom')
    }

    if (filterState.priceTo) {
      newParams.set('priceTo', filterState.priceTo)
    } else {
      newParams.delete('priceTo')
    }

    // Availability filters
    if (filterState.availability.length > 0) {
      newParams.set('availability', filterState.availability.join(','))
    } else {
      newParams.delete('availability')
    }

    router.push(createUrl(pathname, newParams))
    setIsOpen(false)
  }

  const hasActiveFilters =
    filterState.priceFrom || filterState.priceTo || filterState.availability.length > 0

  const activeFilterCount =
    (filterState.priceFrom || filterState.priceTo ? 1 : 0) + filterState.availability.length

  return (
    <Sheet onOpenChange={setIsOpen} open={isOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="default" className="rounded-md">
          Filters{hasActiveFilters && ` (${activeFilterCount})`}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col w-full sm:max-w-xl h-full p-0">
        <SheetHeader className="border-b px-4 py-4 shrink-0">
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>

        {/* Scrollable Body */}
        <div className="flex flex-col gap-6 px-4 py-4 flex-1 overflow-y-auto min-h-0">
          {/* Price Range Filter */}
          <Collapsible open={isPriceRangeOpen} onOpenChange={setIsPriceRangeOpen}>
            <div className="flex flex-col gap-4">
              <CollapsibleTrigger className="flex items-center justify-between w-full">
                <h3 className="text-sm font-medium">Price Range</h3>
                <ChevronUp
                  className={`size-4 transition-transform ${isPriceRangeOpen ? '' : 'rotate-180'}`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="flex gap-4 items-center pt-2">
                  <div className="flex flex-col gap-2 flex-1">
                    <label htmlFor="price-from" className="text-xs text-muted-foreground uppercase">
                      FROM
                    </label>
                    <Input
                      id="price-from"
                      type="number"
                      placeholder="1"
                      value={filterState.priceFrom}
                      onChange={(e) => handlePriceChange('priceFrom', e.target.value)}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="flex flex-col gap-2 flex-1">
                    <label htmlFor="price-to" className="text-xs text-muted-foreground uppercase">
                      TO
                    </label>
                    <Input
                      id="price-to"
                      type="number"
                      placeholder="1000"
                      value={filterState.priceTo}
                      onChange={(e) => handlePriceChange('priceTo', e.target.value)}
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>

          {/* Availability Filter */}
          <Collapsible open={isAvailabilityOpen} onOpenChange={setIsAvailabilityOpen}>
            <div className="flex flex-col gap-4">
              <CollapsibleTrigger className="flex items-center justify-between w-full">
                <h3 className="text-sm font-medium">Availability</h3>
                <ChevronUp
                  className={`size-4 transition-transform ${isAvailabilityOpen ? '' : 'rotate-180'}`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="flex flex-col gap-3 pt-2">
                  {AVAILABILITY_OPTIONS.map((option) => {
                    const isSelected = filterState.availability.includes(option.value)

                    return (
                      <label
                        key={option.value}
                        className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleAvailabilityToggle(option.value)}
                        />
                        <span className="text-sm">{option.label}</span>
                      </label>
                    )
                  })}
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        </div>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 z-10 bg-background border-t px-4 py-4 flex flex-col gap-3 shrink-0">
          <Button
            variant="outline"
            onClick={handleClearAll}
            className="w-full"
            disabled={!hasActiveFilters}
          >
            CLEAR ALL
          </Button>
          <Button variant="default" onClick={handleApplyFilters} className="w-full">
            APPLY FILTERS
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
