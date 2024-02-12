'use client'

import * as Primitive from '@radix-ui/react-avatar'

import { cva, type VariantProps } from 'class-variance-authority'
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from 'react'

import { cn } from '@/utils/cn'

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
    defaultVariants: {
      size: 'md',
    },
  },
)

type AvatarFallbackVariants = VariantProps<typeof avatarFallbackVariants>

type AvatarFallbackRef = ElementRef<typeof Primitive.Fallback>

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
