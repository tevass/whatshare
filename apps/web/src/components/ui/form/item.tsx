'use client'

import { cn } from '@/utils/cn'
import { createContext, forwardRef, HTMLAttributes, useId } from 'react'

type FormItemContextValue = {
  id: string
}

export const FormItemContext = createContext({} as FormItemContextValue)

export type FormItemProps = HTMLAttributes<HTMLDivElement>

export const FormItem = forwardRef<HTMLDivElement, FormItemProps>(
  ({ className, ...props }, ref) => {
    const id = useId()

    return (
      <FormItemContext.Provider value={{ id }}>
        <div ref={ref} className={cn('space-y-1', className)} {...props} />
      </FormItemContext.Provider>
    )
  },
)
FormItem.displayName = 'Form.Item'
