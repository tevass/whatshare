'use client'

import { Link, LinkProps } from '@/components/ui/link'
import { useIsActiveLink } from '@/hooks/use-is-active-link'
import { cn } from '@/utils/cn'
import { forwardRef } from 'react'

type ChatProps = LinkProps

export const Chat = forwardRef<HTMLAnchorElement, ChatProps>(
  ({ className, ...props }, ref) => {
    const isActive = useIsActiveLink({ href: props.href, exactMatch: true })

    return (
      <Link
        ref={ref}
        className={cn(
          'rounded-md p-2.5 transition-colors flex items-center space-x-3 hover:bg-muted data-[state=active]:bg-accent',
          className,
        )}
        data-state={isActive ? 'active' : 'inactive'}
        {...props}
      />
    )
  },
)
Chat.displayName = 'Chat'
