'use client'

import * as Primitive from '@radix-ui/react-avatar'

import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from 'react'

import { cn } from '@/utils/cn'

type AvatarImageRef = ElementRef<typeof Primitive.Image>

export type AvatarImageProps = ComponentPropsWithoutRef<typeof Primitive.Image>

export const AvatarImage = forwardRef<AvatarImageRef, AvatarImageProps>(
  ({ className, ...props }, ref) => (
    <Primitive.Image
      ref={ref}
      className={cn('aspect-square h-full w-full', className)}
      {...props}
    />
  ),
)
AvatarImage.displayName = Primitive.Image.displayName
