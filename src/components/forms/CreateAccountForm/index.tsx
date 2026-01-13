'use client'

import { FormError } from '@/components/forms/FormError'
import { FormItem } from '@/components/forms/FormItem'
import { Message } from '@/components/Message'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/providers/Auth'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useCallback, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

type FormData = {
  email: string
  password: string
  passwordConfirm: string
}

export const CreateAccountForm: React.FC = () => {
  const searchParams = useSearchParams()
  const allParams = searchParams.toString() ? `?${searchParams.toString()}` : ''
  const { login } = useAuth()
  const router = useRouter()
  const [error, setError] = useState<null | string>(null)

  const {
    formState: { errors, isLoading },
    handleSubmit,
    register,
    watch,
  } = useForm<FormData>()

  const password = useRef({})
  password.current = watch('password', '')

  const onSubmit = useCallback(
    async (data: FormData) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users`, {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      if (!response.ok) {
        const message = response.statusText || 'There was an error creating the account.'
        setError(message)
        return
      }

      const redirect = searchParams.get('redirect')

      try {
        await login(data)
        if (redirect) router.push(redirect)
        else router.push(`/account?success=${encodeURIComponent('Account created successfully')}`)
      } catch (_) {
        setError('There was an error with the credentials provided. Please try again.')
      }
    },
    [login, router, searchParams],
  )

  return (
    <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-4xl font-light mb-8">Create Account</h1>

      <Message error={error} />

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
          <Label htmlFor="password" className="text-sm uppercase tracking-wide">
            PASSWORD*
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            autoComplete="new-password"
            className="h-12"
            {...register('password', { required: 'Password is required.' })}
          />
          {errors.password && <FormError message={errors.password.message} />}
        </FormItem>

        <FormItem>
          <Label htmlFor="passwordConfirm" className="text-sm uppercase tracking-wide">
            CONFIRM PASSWORD*
          </Label>
          <Input
            id="passwordConfirm"
            type="password"
            placeholder="Confirm your password"
            autoComplete="new-password"
            className="h-12"
            {...register('passwordConfirm', {
              required: 'Please confirm your password.',
              validate: (value) => value === password.current || 'The passwords do not match',
            })}
          />
          {errors.passwordConfirm && <FormError message={errors.passwordConfirm.message} />}
        </FormItem>
      </div>

      <Button
        className="w-fit rounded-full mb-4 uppercase"
        disabled={isLoading}
        size="lg"
        type="submit"
      >
        {isLoading ? 'Processing' : 'CREATE ACCOUNT'}
      </Button>

      <div className="border-t border-gray-200 my-8"></div>

      <h2 className="text-xl font-light mb-4">Already have an account?</h2>

      <Button asChild className="w-fit rounded-full uppercase" size="lg">
        <Link href={`/login${allParams}`}>LOG IN</Link>
      </Button>
    </form>
  )
}
