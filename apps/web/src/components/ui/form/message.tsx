'use client'

import { forwardRef, type HTMLAttributes } from 'react'
import { useFormField } from './use-form-field'

import { cn } from '@/utils/cn'

type FormMessageRef = HTMLParagraphElement

export type FormMessageProps = HTMLAttributes<HTMLParagraphElement>

export const FormMessage = forwardRef<FormMessageRef, FormMessageProps>(
  ({ className, children, ...props }, ref) => {
    const { error, formMessageId } = useFormField()
    const body = error ? String(error?.message) : children

    if (!body) {
      return null
    }

    return (
      <p
        ref={ref}
        id={formMessageId}
        className={cn('text-sm font-medium text-destructive', className)}
        {...props}
      >
        {body}
      </p>
    )
  },
)
FormMessage.displayName = 'Form.Message'
