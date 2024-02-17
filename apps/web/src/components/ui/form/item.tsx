'use client'

import { forwardRef, useId, type HTMLAttributes } from 'react'
import { FormItemProvider } from './item-context'

import { cn } from '@/utils/cn'

type FormItemRef = HTMLDivElement

export type FormItemProps = HTMLAttributes<HTMLDivElement>

export const FormItem = forwardRef<FormItemRef, FormItemProps>(
  ({ className, ...props }, ref) => {
    const id = useId()

    return (
      <FormItemProvider value={{ id }}>
        <div ref={ref} className={cn('space-y-2', className)} {...props} />
      </FormItemProvider>
    )
  },
)
FormItem.displayName = 'Form.Item'
