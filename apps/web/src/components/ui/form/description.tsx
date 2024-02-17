'use client'

import { forwardRef, type HTMLAttributes } from 'react'
import { useFormField } from './use-form-field'

import { cn } from '@/utils/cn'

type FormDescriptionRef = HTMLParagraphElement

export type FormDescriptionProps = HTMLAttributes<HTMLParagraphElement>

export const FormDescription = forwardRef<
  FormDescriptionRef,
  FormDescriptionProps
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField()

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
})
FormDescription.displayName = 'Form.Description'
