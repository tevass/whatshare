import { httpAttendant } from '@/entities'
import { z } from 'zod'

export const authenticatedResponseBodySchema = z.object({
  attendant: httpAttendant,
})

export type AuthenticatedResponseBodySchema = z.infer<
  typeof authenticatedResponseBodySchema
>
