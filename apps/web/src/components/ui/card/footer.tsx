import { forwardRef, type ComponentRef } from 'react'
import { Footer, type FooterProps } from '../footer'

import { cn } from '@/utils/cn'

type CardFooterRef = ComponentRef<typeof Footer>

export type CardFooterProps = FooterProps

export const CardFooter = forwardRef<CardFooterRef, CardFooterProps>(
  ({ className, ...props }, ref) => (
    <Footer
      ref={ref}
      className={cn('flex items-center p-6 pt-0', className)}
      {...props}
    />
  ),
)
CardFooter.displayName = 'Card.Footer'
