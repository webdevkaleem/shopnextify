'use client'

import { AddressItem } from '@/components/addresses/AddressItem'
import { CreateAddressCollapsible } from '@/components/addresses/CreateAddressCollapsible'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Address } from '@/payload-types'
import { cn } from '@/utilities/cn'
import { useAddresses } from '@payloadcms/plugin-ecommerce/client/react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

type Props = {
  selectedAddress?: Address
  setAddress: React.Dispatch<React.SetStateAction<Partial<Address> | undefined>>
  heading?: string
  description?: string
  setSubmit?: React.Dispatch<React.SetStateAction<() => void | Promise<void>>>
}

export const CheckoutAddresses: React.FC<Props> = ({
  setAddress,
  heading = 'Addresses',
  description = 'Please select or add your shipping and billing addresses.',
}) => {
  const { addresses } = useAddresses()

  if (!addresses || addresses.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-muted-foreground">No addresses found. Please add an address.</p>

        <CreateAddressCollapsible
          defaultOpen={true}
          title={heading}
          buttonText="Add a new address"
          description="This address will be connected to your account."
          callback={(address) => {
            setAddress(address)
          }}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-xl font-medium mb-2">{heading}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <AddressSelector setAddress={setAddress} />
    </div>
  )
}

const AddressSelector: React.FC<Props> = ({ setAddress }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { addresses } = useAddresses()

  if (!addresses || addresses.length === 0) {
    return <p className="text-muted-foreground">No addresses found. Please add an address.</p>
  }

  return (
    <div className="flex flex-col gap-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <span>Select from saved addresses ({addresses.length})</span>
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <div className="bg-accent dark:bg-card p-4 rounded-lg border">
            <ul className="flex flex-col gap-4">
              {addresses.map((address) => (
                <li key={address.id} className={cn('border-b pb-4 last:border-none last:pb-0')}>
                  <AddressItem
                    address={address}
                    beforeActions={
                      <Button
                        onClick={(e) => {
                          e.preventDefault()
                          setAddress(address)
                          setIsOpen(false)
                        }}
                      >
                        Select
                      </Button>
                    }
                  />
                </li>
              ))}
            </ul>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <CreateAddressCollapsible
        title="Add a new address"
        buttonText="Add a new address"
        description="This address will be connected to your account."
        callback={(address) => {
          setAddress(address)
        }}
      />
    </div>
  )
}
