import { forwardRef, type ComponentRef } from 'react'
import { Header, type HeaderProps } from '../header'

import { cn } from '@/utils/cn'

type CardHeaderRef = ComponentRef<typeof Header>

export type CardHeaderProps = HeaderProps

export const CardHeader = forwardRef<CardHeaderRef, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <Header
      ref={ref}
      className={cn('flex flex-col space-y-1.5 p-6', className)}
      {...props}
    />
  ),
)
CardHeader.displayName = 'Card.Header'
