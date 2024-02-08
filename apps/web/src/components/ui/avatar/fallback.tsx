'use client'

import * as Primitive from '@radix-ui/react-avatar'

import { cn } from '@/utils/cn'
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'
import { VariantProps, cva } from 'class-variance-authority'

const avatarFallbackVariants = cva(
  'flex h-full w-full items-center justify-center rounded-full bg-muted',
  {
    variants: {
      size: {
        xs: 'text-xs',
        sm: 'text-sm',
        md: 'text-base',
      },
    },
  },
)

type AvatarFallbackRef = ElementRef<typeof Primitive.Fallback>

type AvatarFallbackVariants = VariantProps<typeof avatarFallbackVariants>

export interface AvatarFallbackProps
  extends ComponentPropsWithoutRef<typeof Primitive.Fallback>,
    AvatarFallbackVariants {}

export const AvatarFallback = forwardRef<
  AvatarFallbackRef,
  AvatarFallbackProps
>(({ size, className, ...props }, ref) => (
  <Primitive.Fallback
    ref={ref}
    className={cn(avatarFallbackVariants({ size, className }))}
    {...props}
  />
))
AvatarFallback.displayName = Primitive.Fallback.displayName
