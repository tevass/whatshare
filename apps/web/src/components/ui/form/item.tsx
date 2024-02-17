'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef, useId, type HTMLAttributes } from 'react'
import { FormItemProvider } from './item-context'

import { cn } from '@/utils/cn'

const formItemVariants = cva('', {
  variants: {
    orientation: {
      vertical: 'space-y-2',
      horizontal: 'flex items-center space-x-2',
    },
  },
  defaultVariants: {
    orientation: 'vertical',
  },
})

type FormItemVariants = VariantProps<typeof formItemVariants>

type FormItemRef = HTMLDivElement

export interface FormItemProps
  extends HTMLAttributes<HTMLDivElement>,
    FormItemVariants {}

export const FormItem = forwardRef<FormItemRef, FormItemProps>(
  ({ className, orientation, ...props }, ref) => {
    const id = useId()

    return (
      <FormItemProvider value={{ id }}>
        <div
          ref={ref}
          className={cn(formItemVariants({ orientation, className }))}
          {...props}
        />
      </FormItemProvider>
    )
  },
)
FormItem.displayName = 'Form.Item'
