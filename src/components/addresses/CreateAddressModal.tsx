'use client'
import { AddressForm } from '@/components/forms/AddressForm'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Address } from '@/payload-types'
import { cn } from '@/utilities/cn'
import { ChevronDown, ChevronUp, Plus } from 'lucide-react'
import { DefaultDocumentIDType } from 'payload'
import React, { useState } from 'react'

type Props = {
  addressID?: DefaultDocumentIDType
  initialData?: Partial<Omit<Address, 'country'>> & { country?: string }
  buttonText?: string
  modalTitle?: string
  description?: string
  callback?: (address: Partial<Address>) => void
  skipSubmission?: boolean
  disabled?: boolean
  defaultOpen?: boolean
}

export const CreateAddressModal: React.FC<Props> = ({
  addressID,
  initialData,
  buttonText = 'Add a new address',
  modalTitle = 'Add a new address',
  description = 'This address will be connected to your account.',
  callback,
  skipSubmission,
  disabled,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const handleCallback = (data: Partial<Address>) => {
    setIsOpen(false)

    if (callback) {
      callback(data)
    }
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <CollapsibleTrigger asChild disabled={disabled}>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-between rounded-none',
            disabled && 'opacity-50 cursor-not-allowed',
          )}
          disabled={disabled}
        >
          <span className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {buttonText}
          </span>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-4">
        <div className="bg-accent dark:bg-card p-6 border">
          <div className="mb-6">
            <h3 className="text-lg font-medium">{modalTitle}</h3>
            {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
          </div>

          <AddressForm
            addressID={addressID}
            initialData={initialData}
            callback={handleCallback}
            skipSubmission={skipSubmission}
          />

          <Button
            variant="destructive"
            className="mt-4"
            onClick={(e) => {
              e.preventDefault()
              setIsOpen(false)
            }}
          >
            Cancel
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
