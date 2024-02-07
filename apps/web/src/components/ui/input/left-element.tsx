import { cn } from '@/lib/utils'
import { HTMLAttributes, forwardRef } from 'react'

export type InputLeftElementProps = HTMLAttributes<HTMLDivElement>

export const InputLeftElement = forwardRef<
  HTMLDivElement,
  InputLeftElementProps
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'absolute flex items-center justify-center inset-x-center left-3',
        className,
      )}
      {...props}
    />
  )
})
InputLeftElement.displayName = 'Input.LeftElement'
