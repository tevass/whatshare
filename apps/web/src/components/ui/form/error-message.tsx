'use client'

import { cn } from '@/utils/cn'
import { forwardRef, HTMLAttributes } from 'react'
import { useFormField } from './use-form-field'

export type FormErrorMessageProps = HTMLAttributes<HTMLParagraphElement>

export const FormErrorMessage = forwardRef<
  HTMLParagraphElement,
  FormErrorMessageProps
>(({ className, children, ...props }, ref) => {
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
})
FormErrorMessage.displayName = 'Form.ErrorMessage'
