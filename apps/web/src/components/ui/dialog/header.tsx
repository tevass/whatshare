import { forwardRef, type HTMLAttributes } from 'react'

import { cn } from '@/utils/cn'

type DialogHeaderRef = HTMLElement

export type DialogHeaderProps = HTMLAttributes<HTMLElement>

export const DialogHeader = forwardRef<DialogHeaderRef, DialogHeaderProps>(
  ({ className, ...props }, ref) => (
    <header
      ref={ref}
      className={cn(
        'flex flex-col space-y-1.5 text-center sm:text-left',
        className,
      )}
      {...props}
    />
  ),
)
DialogHeader.displayName = 'Dialog.Header'
