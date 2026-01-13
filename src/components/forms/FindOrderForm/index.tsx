'use client'

import { FormError } from '@/components/forms/FormError'
import { FormItem } from '@/components/forms/FormItem'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/providers/Auth'
import { useRouter } from 'next/navigation'
import React, { useCallback } from 'react'
import { useForm } from 'react-hook-form'

type FormData = {
  email: string
  orderID: string
}

type Props = {
  initialEmail?: string
}

export const FindOrderForm: React.FC<Props> = ({ initialEmail }) => {
  const router = useRouter()
  const { user } = useAuth()

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<FormData>({
    defaultValues: {
      email: initialEmail || user?.email,
    },
  })

  const onSubmit = useCallback(
    async (data: FormData) => {
      router.push(`/orders/${data.orderID}?email=${data.email}`)
    },
    [router],
  )

  return (
    <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-4xl font-light mb-8">Find my order</h1>

      <div className="prose dark:prose-invert mb-6">
        <p className="text-sm">{`Please enter your email and order ID below.`}</p>
      </div>

      <div className="flex flex-col gap-6 mb-6">
        <FormItem>
          <Label htmlFor="email" className="text-sm uppercase tracking-wide">
            EMAIL*
          </Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              className="h-12"
              {...register('email', { required: 'Email is required.' })}
            />
          </div>
          {errors.email && <FormError message={errors.email.message} />}
        </FormItem>

        <FormItem>
          <Label htmlFor="orderID" className="text-sm uppercase tracking-wide">
            ORDER ID*
          </Label>
          <Input
            id="orderID"
            type="text"
            placeholder="Enter your order ID"
            className="h-12"
            {...register('orderID', {
              required: 'Order ID is required. You can find this in your email.',
            })}
          />
          {errors.orderID && <FormError message={errors.orderID.message} />}
        </FormItem>
      </div>

      <Button
        className="w-fit rounded-full mb-4 uppercase"
        size="lg"
        type="submit"
        variant="default"
      >
        FIND MY ORDER
      </Button>
    </form>
  )
}
