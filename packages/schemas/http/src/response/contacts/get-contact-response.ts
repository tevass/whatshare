import { httpContact } from '@/entities'
import { z } from 'zod'

export const getContactResponseBodySchema = z.object({
  contact: httpContact,
})

export type GetContactResponseBodySchema = z.infer<
  typeof getContactResponseBodySchema
>
