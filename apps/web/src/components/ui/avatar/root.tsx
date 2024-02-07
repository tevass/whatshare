'use client'

import * as Primitive from '@radix-ui/react-avatar'

import { cn } from '@/utils/cn'
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

type AvatarRef = ElementRef<typeof Primitive.Root>

export type AvatarProps = ComponentPropsWithoutRef<typeof Primitive.Root>

export const Avatar = forwardRef<AvatarRef, AvatarProps>(
  ({ className, ...props }, ref) => (
    <Primitive.Root
      ref={ref}
      className={cn(
        'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
        className,
      )}
      {...props}
    />
  ),
)
Avatar.displayName = Primitive.Root.displayName
