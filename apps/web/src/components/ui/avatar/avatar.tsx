'use client'

import * as Primitive from '@radix-ui/react-avatar'
import { cva, type VariantProps } from 'class-variance-authority'
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from 'react'

import { cn } from '@/utils/cn'

const avatarVariants = cva(
  'relative flex shrink-0 overflow-hidden rounded-full',
  {
    variants: {
      size: {
        xs: 'h-6 w-6',
        sm: 'h-8 w-8',
        md: 'h-10 w-10',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
)

type AvatarVariants = VariantProps<typeof avatarVariants>

type AvatarRef = ElementRef<typeof Primitive.Root>

export interface AvatarProps
  extends ComponentPropsWithoutRef<typeof Primitive.Root>,
    AvatarVariants {}

export const Avatar = forwardRef<AvatarRef, AvatarProps>(
  ({ className, size, ...props }, ref) => (
    <Primitive.Root
      ref={ref}
      className={cn(avatarVariants({ size, className }))}
      {...props}
    />
  ),
)
Avatar.displayName = Primitive.Root.displayName
