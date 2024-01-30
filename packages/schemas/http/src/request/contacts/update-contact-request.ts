import { z } from 'zod'

export const updateContactRequestBodySchema = z.object({
  name: z.string(),
  number: z.string().regex(/^(\d{2})(\d{2})(\d{4,5})(\d{4})/g),
})

export type UpdateContactRequestBodySchema = z.infer<
  typeof updateContactRequestBodySchema
>
