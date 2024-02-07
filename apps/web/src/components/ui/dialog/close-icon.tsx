import { ElementRef, forwardRef } from 'react'
import { DialogClose, DialogCloseProps } from './close'
import { cn } from '@/utils/cn'

type DialogCloseIconRef = ElementRef<typeof DialogClose>
export type DialogCloseIconProps = DialogCloseProps

export const DialogCloseIcon = forwardRef<
  DialogCloseIconRef,
  DialogCloseIconProps
>(({ className, ...props }, ref) => {
  return (
    <DialogClose
      ref={ref}
      className={cn(
        'absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground',
        className,
      )}
      {...props}
    />
  )
})
DialogCloseIcon.displayName = 'Dialog.CloseIcon'
