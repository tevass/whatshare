import { forwardRef, type ComponentRef } from 'react'
import { Footer, type FooterProps } from '../footer'

import { cn } from '@/utils/cn'

type DialogFooterRef = ComponentRef<typeof Footer>

export type DialogFooterProps = FooterProps

export const DialogFooter = forwardRef<DialogFooterRef, DialogFooterProps>(
  ({ className, ...props }, ref) => (
    <Footer
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
