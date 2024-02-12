'use client'

import { Button } from '@/components/ui/button'
import {
  Navigation,
  type NavigationLinkProps,
} from '@/components/ui/navigation'
import { forwardRef, type ElementRef } from 'react'

import { useIsActivePathname } from '@/hooks/use-is-active-pathname'

import { cn } from '@/utils/cn'

type SidebarLinkRef = ElementRef<typeof Navigation.Link>

export type SidebarLinkProps = NavigationLinkProps

export const SidebarLink = forwardRef<SidebarLinkRef, SidebarLinkProps>(
  ({ className, ...props }, ref) => {
    const isActive = useIsActivePathname({ href: props.href })

    return (
      <Button
        size="icon"
        variant={!isActive ? 'ghost' : 'primary'}
        className={cn(!isActive && 'hover:bg-foreground/10', className)}
        asChild
      >
        <Navigation.Link ref={ref} {...props} />
      </Button>
    )
  },
)
SidebarLink.displayName = 'SidebarLink'
