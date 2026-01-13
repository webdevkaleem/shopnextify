import { Button } from '@/components/ui/button'
import { cn } from '@/utilities/cn'
import { ShoppingCart } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export function OpenCartButton({
  className,
  quantity,
  onClick,
  ...rest
}: {
  className?: string
  quantity?: number
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}) {
  const [scrollY, setScrollY] = useState(0)
  const pathname = usePathname()

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <Button
      type="button"
      variant="fade"
      size="clear"
      className={cn('relative hover:cursor-pointer p-0 text-background', {
        'dark:text-foreground': pathname === '/',
        'text-background dark:text-background': scrollY > 0,
      })}
      onClick={onClick}
      {...rest}
    >
      <ShoppingCart className="size-5 text-current" />

      {quantity ? (
        <span
          className={cn(
            'absolute -top-2 -right-2 bg-background text-foreground rounded-full w-4 h-4 flex items-center justify-center',
            {
              'w-6 h-6 -top-3 -right-3': quantity > 9,
            },
            {
              'dark:bg-foreground dark:text-background': pathname === '/' && scrollY === 0,
            },
          )}
        >
          {quantity > 9 ? '9+' : quantity}
        </span>
      ) : null}
    </Button>
  )
}
