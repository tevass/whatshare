'use client'

import * as Primitive from '@radix-ui/react-avatar'

import { cn } from '@/utils/cn'
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'
import { VariantProps, cva } from 'class-variance-authority'

const avatarVariants = cva(
  'relative fle shrink-0 overflow-hidden rounded-full',
  {
    variants: {
      size: {
        xs: 'h-6 w-6',
        sm: 'h-8 w-8',
        md: 'h-10 w-10',
        lg: 'h-12 w-12',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
)

type AvatarRef = ElementRef<typeof Primitive.Root>

type AvatarVariants = VariantProps<typeof avatarVariants>
export type AvatarProps = ComponentPropsWithoutRef<typeof Primitive.Root> &
  AvatarVariants

export const Avatar = forwardRef<AvatarRef, AvatarProps>(
  ({ className, size, ...props }, ref) => (
    <Primitive.Root
      ref={ref}
      className={cn(avatarVariants({ size, className }), className)}
      {...props}
    />
  ),
)
Avatar.displayName = Primitive.Root.displayName
