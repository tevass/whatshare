import { forwardRef, type ComponentRef } from 'react'
import { Header, type HeaderProps } from '../header'

import { cn } from '@/utils/cn'

type DialogHeaderRef = ComponentRef<typeof Header>

export type DialogHeaderProps = HeaderProps

export const DialogHeader = forwardRef<DialogHeaderRef, DialogHeaderProps>(
  ({ className, ...props }, ref) => (
    <Header
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
