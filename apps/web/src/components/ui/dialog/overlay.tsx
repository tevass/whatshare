import * as Primitive from '@radix-ui/react-dialog'
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from 'react'

import { cn } from '@/utils/cn'

type DialogOverlayRef = ElementRef<typeof Primitive.Overlay>

export type DialogOverlayProps = ComponentPropsWithoutRef<
  typeof Primitive.Overlay
>

export const DialogOverlay = forwardRef<DialogOverlayRef, DialogOverlayProps>(
  ({ className, ...props }, ref) => (
    <Primitive.Overlay
      ref={ref}
      className={cn(
        'fixed inset-0 z-50 bg-foreground/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        className,
      )}
      {...props}
    />
  ),
)
DialogOverlay.displayName = Primitive.Overlay.displayName
