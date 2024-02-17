'use client'

import { createContext, type ComponentProps } from 'react'
import { type FieldPath, type FieldValues } from 'react-hook-form'

export interface FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName
}

export const FormFieldContext = createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
)

type FormFieldProviderProps = ComponentProps<typeof FormFieldContext.Provider>

export function FormFieldProvider(props: FormFieldProviderProps) {
  return <FormFieldContext.Provider {...props} />
}
