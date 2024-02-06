'use client'

import { Slot, SlotProps } from '@radix-ui/react-slot'
import { forwardRef, ElementRef } from 'react'
import { useFormField } from './use-form-field'

type ControlRef = ElementRef<typeof Slot>
export type FormControlProps = SlotProps

export const FormControl = forwardRef<ControlRef, FormControlProps>(
  ({ ...props }, ref) => {
    const { error, formItemId, formDescriptionId, formMessageId } =
      useFormField()

    return (
      <Slot
        ref={ref}
        id={formItemId}
        aria-describedby={
          !error
            ? `${formDescriptionId}`
            : `${formDescriptionId} ${formMessageId}`
        }
        aria-invalid={!!error}
        {...props}
      />
    )
  },
)
FormControl.displayName = 'Form.Control'
