import { UseFormProps, UseFormReturn, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { ZodSchema, z } from 'zod'

interface UseZodFormProps<Schema extends ZodSchema>
  extends Omit<UseFormProps<z.input<Schema>>, 'resolver'> {
  schema: Schema
}

type UseZodFormReturn<Schema extends ZodSchema> = UseFormReturn<
  z.input<Schema>,
  unknown,
  z.output<Schema>
>

export function useZodForm<Schema extends ZodSchema>({
  schema,
  ...props
}: UseZodFormProps<Schema>): UseZodFormReturn<Schema> {
  const form = useForm<z.input<Schema>, unknown, z.output<Schema>>({
    ...props,
    resolver: zodResolver(schema),
  })

  return form
}
