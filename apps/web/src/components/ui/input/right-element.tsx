import { cn } from '@/lib/utils'
import { HTMLAttributes, forwardRef } from 'react'

export type InputRightElementProps = HTMLAttributes<HTMLDivElement>

export const InputRightElement = forwardRef<
  HTMLDivElement,
  InputRightElementProps
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'absolute flex items-center justify-center inset-x-center right-2.5',
        className,
      )}
      {...props}
    />
  )
})
InputRightElement.displayName = 'Input.RightElement'
