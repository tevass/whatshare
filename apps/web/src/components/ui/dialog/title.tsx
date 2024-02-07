import * as Primitive from '@radix-ui/react-dialog'

import { cn } from '@/utils/cn'
import { forwardRef, ElementRef, ComponentPropsWithoutRef } from 'react'

type DialogTitleRef = ElementRef<typeof Primitive.Title>
export type DialogTitleProps = ComponentPropsWithoutRef<typeof Primitive.Title>

export const DialogTitle = forwardRef<DialogTitleRef, DialogTitleProps>(
  ({ className, ...props }, ref) => (
    <Primitive.Title
      ref={ref}
      className={cn(
        'text-lg font-semibold leading-none tracking-tight',
        className,
      )}
      {...props}
    />
  ),
)
DialogTitle.displayName = Primitive.Title.displayName
