import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type UseFormProps, type UseFormReturn } from 'react-hook-form'
import { SetRequired, type Except } from 'type-fest'
import { z, type ZodSchema } from 'zod'

type FormProps<Schema extends ZodSchema> = SetRequired<
  Except<UseFormProps<z.input<Schema>>, 'resolver'>,
  'defaultValues'
>

interface UseZodFormProps<Schema extends ZodSchema> extends FormProps<Schema> {
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
