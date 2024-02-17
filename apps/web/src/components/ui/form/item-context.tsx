'use client'

import { createContext, type ComponentProps } from 'react'

interface FormItemContextValue {
  id: string
}

export const FormItemContext = createContext<FormItemContextValue>(
  {} as FormItemContextValue,
)

type FormItemProviderProps = ComponentProps<typeof FormItemContext.Provider>

export function FormItemProvider(props: FormItemProviderProps) {
  return <FormItemContext.Provider {...props} />
}
