import * as Primitive from '@radix-ui/react-dialog'
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from 'react'

import { cn } from '@/utils/cn'

import { DialogOverlay } from './overlay'
import { DialogPortal } from './portal'

type DialogContentRef = ElementRef<typeof Primitive.Content>

export type DialogContentProps = ComponentPropsWithoutRef<
  typeof Primitive.Content
>

export const DialogContent = forwardRef<DialogContentRef, DialogContentProps>(
  ({ className, ...props }, ref) => (
    <DialogPortal>
      <DialogOverlay />

      <Primitive.Content
        ref={ref}
        className={cn(
          'inset-x-center inset-y-center fixed z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg',
          className,
        )}
        {...props}
      />
    </DialogPortal>
  ),
)
DialogContent.displayName = Primitive.Content.displayName
