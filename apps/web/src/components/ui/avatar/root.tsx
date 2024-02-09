'use client'

import * as Primitive from '@radix-ui/react-avatar'

import { cn } from '@/utils/cn'
import { VariantProps, cva } from 'class-variance-authority'
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

const avatarVariants = cva(
  'relative fle shrink-0 overflow-hidden rounded-full',
  {
    variants: {
      size: {
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
