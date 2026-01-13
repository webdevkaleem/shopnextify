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
import React, { useCallback, useRef } from 'react'
import { useForm } from 'react-hook-form'

type FormData = {
  email: string
  password: string
}

export const LoginForm: React.FC = () => {
  const searchParams = useSearchParams()
  const allParams = searchParams.toString() ? `?${searchParams.toString()}` : ''
  const redirect = useRef(searchParams.get('redirect'))
  const { login } = useAuth()
  const router = useRouter()
  const [error, setError] = React.useState<null | string>(null)

  const {
    formState: { errors, isLoading },
    handleSubmit,
    register,
  } = useForm<FormData>()

  const onSubmit = useCallback(
    async (data: FormData) => {
      try {
        await login(data)
        if (redirect?.current) router.push(redirect.current)
        else router.push('/account')
      } catch (_) {
        setError('There was an error with the credentials provided. Please try again.')
      }
    },
    [login, router],
  )

  return (
    <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-4xl font-light mb-8">Welcome back!</h1>

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
            autoComplete="current-password"
            className="h-12"
            {...register('password', { required: 'Please provide a password.' })}
          />
          {errors.password && <FormError message={errors.password.message} />}
        </FormItem>
      </div>

      <Button
        className="w-fit rounded-full mb-4 uppercase"
        disabled={isLoading}
        size="lg"
        type="submit"
      >
        {isLoading ? 'Processing' : 'LOG IN'}
      </Button>

      <div className="mb-6">
        <Link href={`/recover-password${allParams}`} className="text-sm uppercase underline">
          FORGOT YOUR PASSWORD?
        </Link>
      </div>

      <div className="border-t border-gray-200 my-8"></div>

      <h2 className="text-xl font-light mb-4">Don&apos;t have an account?</h2>

      <Button asChild className="w-fit rounded-full uppercase" size="lg">
        <Link href={`/create-account${allParams}`}>CREATE ACCOUNT</Link>
      </Button>
    </form>
  )
}
