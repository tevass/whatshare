'use client'

import * as Primitive from '@radix-ui/react-avatar'

import { cn } from '@/utils/cn'
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

type AvatarFallbackRef = ElementRef<typeof Primitive.Fallback>

export type AvatarFallbackProps = ComponentPropsWithoutRef<
  typeof Primitive.Fallback
>

export const AvatarFallback = forwardRef<
  AvatarFallbackRef,
  AvatarFallbackProps
>(({ className, ...props }, ref) => (
  <Primitive.Fallback
    ref={ref}
    className={cn(
      'flex h-full w-full items-center justify-center rounded-full bg-muted',
      className,
    )}
    {...props}
  />
))
AvatarFallback.displayName = Primitive.Fallback.displayName
