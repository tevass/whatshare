'use client'

import { cn } from '@/utils/cn'
import { ElementRef, forwardRef } from 'react'
import { LabelProps, Label as RootLabel } from '../label'
import { useFormField } from './use-form-field'

type LabelRef = ElementRef<typeof RootLabel>
export type FormLabelProps = LabelProps

export const FormLabel = forwardRef<LabelRef, FormLabelProps>(
  ({ className, ...props }, ref) => {
    const { error, formItemId } = useFormField()

    return (
      <RootLabel
        ref={ref}
        htmlFor={formItemId}
        variant={error ? 'error' : null}
        className={cn(className)}
        {...props}
      />
    )
  },
)
FormLabel.displayName = 'Form.Label'
