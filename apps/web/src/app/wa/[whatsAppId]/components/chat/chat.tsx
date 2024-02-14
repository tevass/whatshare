'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef, type ComponentRef } from 'react'

import { Link, type LinkProps } from '@/components/ui/link'
import { useIsActivePathname } from '@/hooks/use-is-active-pathname'

import { cn } from '@/utils/cn'

const chatVariants = cva(
  'rounded-md px-4 py-3 transition-colors flex items-center space-x-3 -mx-3',
  {
    variants: {
      variant: {
        default: 'hover:bg-accent',
        active: 'bg-accent hover:bg-foreground/10',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

type ChatVariants = VariantProps<typeof chatVariants>

type ChatRef = ComponentRef<typeof Link>

export interface ChatProps extends LinkProps, ChatVariants {}

export const Chat = forwardRef<ChatRef, ChatProps>(
  ({ className, variant, ...props }, ref) => {
    const isActive = useIsActivePathname({ href: props.href, exactMatch: true })

    return (
      <Link
        ref={ref}
        className={cn(
          chatVariants({
            variant: variant ?? (isActive ? 'active' : 'default'),
            className,
          }),
        )}
        {...props}
      />
    )
  },
)
Chat.displayName = 'Chat'
