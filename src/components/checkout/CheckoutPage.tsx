'use client'

import { useAuth } from '@/providers/Auth'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

import { Address } from '@/payload-types'
import { cn } from '@/utilities/cn'
import { useAddresses, useCart } from '@payloadcms/plugin-ecommerce/client/react'
import { AddressItem } from '../addresses/AddressItem'
import { CreateAddressCollapsible } from '../addresses/CreateAddressCollapsible'
import { FormItem } from '../forms/FormItem'
import { LoadingSpinner } from '../LoadingSpinner'
import { Media } from '../Media'
import { Price } from '../Price'
import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { CheckoutAddresses } from './CheckoutAddresses'

export const CheckoutPage: React.FC = () => {
  const { user } = useAuth()
  const { cart, isLoading } = useCart()
  /**
   * State to manage the email input for guest checkout.
   */
  const [email, setEmail] = useState('')
  const [emailEditable, setEmailEditable] = useState(true)
  const { addresses } = useAddresses()
  const [shippingAddress, setShippingAddress] = useState<Partial<Address>>()
  const [billingAddress, setBillingAddress] = useState<Partial<Address>>()
  const [billingAddressSameAsShipping, setBillingAddressSameAsShipping] = useState(true)

  const cartIsEmpty = !cart || !cart.items || !cart.items.length

  // On initial load wait for addresses to be loaded and check to see if we can prefill a default one
  useEffect(() => {
    if (!shippingAddress) {
      if (addresses && addresses.length > 0) {
        const defaultAddress = addresses[0]
        if (defaultAddress) {
          setBillingAddress(defaultAddress)
        }
      }
    }
  }, [addresses])

  useEffect(() => {
    return () => {
      setShippingAddress(undefined)
      setBillingAddress(undefined)
      setBillingAddressSameAsShipping(true)
      setEmail('')
      setEmailEditable(true)
    }
  }, [])

  if (isLoading)
    return (
      <div className="w-full h-[calc(100vh-4rem)] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )

  if (cartIsEmpty) {
    return (
      <div className="prose dark:prose-invert py-12 items-center w-full mx-auto h-[calc(100vh-4rem)] flex flex-col justify-center">
        <h2 className="text-3xl font-light">Your cart is currently empty</h2>
        <Link href="/shop">Start shopping</Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col my-8 md:flex-row grow gap-10 md:gap-6 lg:gap-8 lg:items-start">
      <div className="basis-full lg:basis-1/2 flex flex-col gap-8">
        <h2 className="font-medium text-3xl">Contact</h2>
        {!user && (
          <div className="border p-4 w-full flex items-center">
            <div className="prose dark:prose-invert flex flex-col gap-4">
              <Button asChild className="no-underline text-inherit" variant="outline">
                <Link href="/login">Log in</Link>
              </Button>
              <p className="mt-0">
                <span className="mx-2">or</span>
                <Link href="/create-account">create an account</Link>
              </p>
            </div>
          </div>
        )}
        {user ? (
          <div className="border p-4">
            <div>
              <p>{user.email}</p>{' '}
              <p>
                Not you?{' '}
                <Link className="underline" href="/logout">
                  Log out
                </Link>
              </p>
            </div>
          </div>
        ) : (
          <div className="border p-4 ">
            <div>
              <p className="mb-4">Enter your email to checkout as a guest.</p>

              <FormItem className="mb-6">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  disabled={!emailEditable}
                  id="email"
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  type="email"
                />
              </FormItem>

              <Button
                disabled={!email || !emailEditable}
                onClick={(e) => {
                  e.preventDefault()
                  setEmailEditable(false)
                }}
                variant="default"
              >
                Continue as guest
              </Button>
            </div>
          </div>
        )}

        <h2 className="font-medium text-3xl">Address</h2>

        {billingAddress ? (
          <div>
            <AddressItem
              actions={
                <Button
                  variant={'outline'}
                  onClick={(e) => {
                    e.preventDefault()
                    setBillingAddress(undefined)
                  }}
                >
                  Remove
                </Button>
              }
              address={billingAddress}
            />
          </div>
        ) : user ? (
          <CheckoutAddresses heading="Billing address" setAddress={setBillingAddress} />
        ) : (
          <CreateAddressCollapsible
            disabled={!email || Boolean(emailEditable)}
            callback={(address) => {
              setBillingAddress(address)
            }}
            skipSubmission={true}
            title="Billing address"
            buttonText="Add billing address"
            description="Enter your billing address details."
          />
        )}

        <div className="flex gap-4 items-center">
          <Checkbox
            id="shippingTheSameAsBilling"
            checked={billingAddressSameAsShipping}
            disabled={!user && (!email || Boolean(emailEditable))}
            onCheckedChange={(state) => {
              setBillingAddressSameAsShipping(state as boolean)
            }}
          />
          <Label htmlFor="shippingTheSameAsBilling">Shipping is the same as billing</Label>
        </div>

        {!billingAddressSameAsShipping && (
          <>
            {shippingAddress ? (
              <div>
                <AddressItem
                  actions={
                    <Button
                      variant={'outline'}
                      onClick={(e) => {
                        e.preventDefault()
                        setShippingAddress(undefined)
                      }}
                    >
                      Remove
                    </Button>
                  }
                  address={shippingAddress}
                />
              </div>
            ) : user ? (
              <CheckoutAddresses
                heading="Shipping address"
                description="Please select a shipping address."
                setAddress={setShippingAddress}
              />
            ) : (
              <CreateAddressCollapsible
                callback={(address) => {
                  setShippingAddress(address)
                }}
                disabled={!email || Boolean(emailEditable)}
                skipSubmission={true}
                title="Shipping address"
                buttonText="Add shipping address"
                description="Enter your shipping address details."
              />
            )}
          </>
        )}

        <Button className="self-start" disabled>
          Go to payment
        </Button>
        <p className="text-muted-foreground text-sm">
          * Please note that the payment method is not yet implemented.
        </p>
      </div>

      {!cartIsEmpty && (
        <div className="basis-full lg:basis-1/2 lg:pl-8 p-8 border-none bg-primary/5 flex flex-col gap-8 lg:sticky lg:top-24 lg:self-start">
          <h2 className="text-3xl font-medium">Your cart</h2>
          {cart?.items?.map((item, index) => {
            if (typeof item.product === 'object' && item.product) {
              const {
                product,
                product: { meta, title, gallery },
                quantity,
                variant,
              } = item

              if (!quantity) return null

              let image = gallery?.[0]?.image || meta?.image
              let price = product?.priceInPKR

              const isVariant = Boolean(variant) && typeof variant === 'object'

              if (isVariant) {
                price = variant?.priceInPKR

                const imageVariant = product.gallery?.find((item) => {
                  if (!item.variantOption) return false
                  const variantOptionID =
                    typeof item.variantOption === 'object'
                      ? item.variantOption.id
                      : item.variantOption

                  const hasMatch = variant?.options?.some((option) => {
                    if (typeof option === 'object') return option.id === variantOptionID
                    else return option === variantOptionID
                  })

                  return hasMatch
                })

                if (imageVariant && typeof imageVariant.image !== 'string') {
                  image = imageVariant.image
                }
              }

              return (
                <div className="flex w-full flex-row justify-between px-1 py-4" key={index}>
                  <div className="flex flex-row space-x-4">
                    <div className="relative h-32 w-32 border border-foreground/25 bg-foreground">
                      {image && typeof image !== 'string' && (
                        <Media className="h-full w-full object-cover" fill resource={image} />
                      )}
                      <span
                        className={cn(
                          'absolute -top-2 text-sm -right-2 bg-foreground text-background rounded-full w-6 h-6 flex items-center justify-center',
                          {
                            'w-6 h-6 -top-3 -right-3': quantity > 9,
                          },
                        )}
                      >
                        {quantity}
                      </span>
                    </div>
                  </div>
                  <div className="flex sm:flex-row flex-col flex-1 justify-between gap-8">
                    <div className="flex flex-1 flex-col gap-2 px-4">
                      <span className="leading-tight">{title}</span>
                      {typeof price === 'number' && <Price amount={price} className="text-sm" />}
                      {variant && typeof variant === 'object' && (
                        <p className="text-sm capitalize">
                          {variant.options
                            ?.map((option) => {
                              if (typeof option === 'object') return option.label
                              return null
                            })
                            .join(', ')}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-4 px-4 items-center sm:flex-col sm:items-end">
                      <div className="flex items-center min-w-[80px] sm:justify-end">
                        {typeof price === 'number' && (
                          <Price amount={price * quantity} className="text-sm font-medium" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
            return null
          })}
          <hr />
          <div className="flex justify-between items-center gap-2">
            <span className="uppercase">Total</span>{' '}
            <Price className="text-3xl font-medium" amount={cart.subtotal || 0} />
          </div>
        </div>
      )}
    </div>
  )
}
