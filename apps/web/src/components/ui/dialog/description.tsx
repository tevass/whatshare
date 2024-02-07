import * as Primitive from '@radix-ui/react-dialog'

import { cn } from '@/utils/cn'
import { forwardRef, ElementRef, ComponentPropsWithoutRef } from 'react'

type DialogDescriptionRef = ElementRef<typeof Primitive.Description>
export type DialogDescriptionProps = ComponentPropsWithoutRef<
  typeof Primitive.Description
>

export const DialogDescription = forwardRef<
  DialogDescriptionRef,
  DialogDescriptionProps
>(({ className, ...props }, ref) => (
  <Primitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
DialogDescription.displayName = Primitive.Description.displayName
