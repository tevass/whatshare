import { cn } from '@/utils/cn'
import { HTMLAttributes, forwardRef } from 'react'

export type DialogHeaderProps = HTMLAttributes<HTMLElement>

export const DialogHeader = forwardRef<HTMLElement, DialogHeaderProps>(
  ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <header
      className={cn(
        'flex flex-col space-y-1.5 text-center sm:text-left',
        className,
      )}
      {...props}
    />
  ),
)
DialogHeader.displayName = 'Dialog.Header'
