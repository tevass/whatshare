import { forwardRef, type FormHTMLAttributes } from 'react'

type FormContentRef = HTMLFormElement

export type FormContentProps = FormHTMLAttributes<HTMLFormElement>

export const FormContent = forwardRef<FormContentRef, FormContentProps>(
  ({ ...props }, ref) => {
    return <form ref={ref} noValidate {...props} />
  },
)
FormContent.displayName = 'Form.Content'
