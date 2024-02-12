import { forwardRef, type HTMLAttributes } from 'react'

import { cn } from '@/utils/cn'

type DialogFooterRef = HTMLElement

export type DialogFooterProps = HTMLAttributes<HTMLElement>

export const DialogFooter = forwardRef<DialogFooterRef, DialogFooterProps>(
  ({ className, ...props }, ref) => (
    <footer
      ref={ref}
      className={cn(
        'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
        className,
      )}
      {...props}
    />
  ),
)
DialogFooter.displayName = 'Dialog.Footer'
