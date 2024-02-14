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
        xs: 'size-6',
        sm: 'size-8',
        md: 'size-10',
        lg: 'size-12',
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
