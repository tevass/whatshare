import { cn } from '@/utils/cn'
import { HTMLAttributes, forwardRef } from 'react'

export type DialogFooterProps = HTMLAttributes<HTMLElement>

export const DialogFooter = forwardRef<HTMLElement, DialogFooterProps>(
  ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <footer
      className={cn(
        'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2t',
        className,
      )}
      {...props}
    />
  ),
)
DialogFooter.displayName = 'Dialog.Footer'
