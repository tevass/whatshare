import { cn } from '@/utils/cn'
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
        'absolute flex items-center justify-center inset-y-center right-3',
        className,
      )}
      {...props}
    />
  )
})
InputRightElement.displayName = 'Input.RightElement'
