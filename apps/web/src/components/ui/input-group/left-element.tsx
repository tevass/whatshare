import { forwardRef, type HTMLAttributes } from 'react'

import { cn } from '@/utils/cn'

type InputLeftElementRef = HTMLDivElement

export type InputLeftElementProps = HTMLAttributes<HTMLDivElement>

export const InputLeftElement = forwardRef<
  InputLeftElementRef,
  InputLeftElementProps
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'absolute flex items-center justify-center inset-y-center left-3',
        className,
      )}
      {...props}
    />
  )
})
InputLeftElement.displayName = 'InputGroup.LeftElement'
