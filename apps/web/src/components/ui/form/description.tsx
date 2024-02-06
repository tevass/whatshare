'use client'

import { cn } from '@/lib/utils'
import { forwardRef, HTMLAttributes } from 'react'
import { useFormField } from './use-form-field'

export type FormDescriptionProps = HTMLAttributes<HTMLParagraphElement>

export const FormDescription = forwardRef<
  HTMLParagraphElement,
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
