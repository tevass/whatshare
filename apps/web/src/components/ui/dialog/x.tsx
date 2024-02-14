import { X } from 'lucide-react'
import { forwardRef, type ElementRef } from 'react'
import type { Except } from 'type-fest'
import { DialogClose, type DialogCloseProps } from './close'

import { cn } from '@/utils/cn'

type DialogXRef = ElementRef<typeof DialogClose>

export type DialogXProps = Except<DialogCloseProps, 'children'>

export const DialogX = forwardRef<DialogXRef, DialogXProps>(
  ({ className, ...props }, ref) => {
    return (
      <DialogClose
        ref={ref}
        className={cn(
          'absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground',
          className,
        )}
        {...props}
      >
        <X className="size-4" />
        <span className="sr-only">Close</span>
      </DialogClose>
    )
  },
)
DialogX.displayName = 'Dialog.X'
