import { z } from 'zod'

export const createContactRequestBodySchema = z.object({
  name: z.string(),
  number: z.string().regex(/^(\d{2})(\d{2})(\d{4,5})(\d{4})/g),
})

export type CreateContactRequestBodySchema = z.infer<
  typeof createContactRequestBodySchema
>
