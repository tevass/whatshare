import { forwardRef, type ElementRef } from 'react'
import { Label, LabelProps } from '../label'
import { useFormField } from './use-form-field'

import { cn } from '@/utils/cn'

type FormLabelRef = ElementRef<typeof Label>

export type FormLabelProps = LabelProps

export const FormLabel = forwardRef<FormLabelRef, FormLabelProps>(
  ({ className, ...props }, ref) => {
    const { error, formItemId } = useFormField()

    return (
      <Label
        ref={ref}
        className={cn(error && 'text-destructive', className)}
        htmlFor={formItemId}
        {...props}
      />
    )
  },
)
FormLabel.displayName = 'Form.Label'
