import { forwardRef, type HTMLAttributes } from 'react'

import { cn } from '@/utils/cn'

type InputRightElementRef = HTMLDivElement

export type InputRightElementProps = HTMLAttributes<HTMLDivElement>

export const InputRightElement = forwardRef<
  InputRightElementRef,
  InputRightElementProps
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'absolute flex items-center justify-center inset-y-center right-3',
        className,
      )}
      {...props}
    />
  )
})
InputRightElement.displayName = 'InputGroup.RightElement'
