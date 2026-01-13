'use client'

import { useAuth } from '@/providers/Auth'
import Link from 'next/link'
import React, { Fragment, useEffect, useState } from 'react'

export const LogoutPage: React.FC = (props) => {
  const { logout } = useAuth()
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout()
        setSuccess('Logged out successfully.')
      } catch (_) {
        setError('You are already logged out.')
      }
    }

    void performLogout()
  }, [logout])

  return (
    <Fragment>
      {(error || success) && (
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-light">{error || success}</h1>
          <p>
            What would you like to do next?
            <Fragment>
              {' '}
              <Link href="/search" className={'underline'}>
                Click here
              </Link>
              {` to shop.`}
            </Fragment>
            {` To log back in, `}
            <Link href="/login" className={'underline'}>
              Click here
            </Link>
            .
          </p>
        </div>
      )}
    </Fragment>
  )
}
