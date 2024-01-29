import { httpAttendant } from '@/entities'
import { z } from 'zod'

export const refreshAuthenticationResponseBodySchema = z.object({
  attendant: httpAttendant,
})

export type RefreshAuthenticationResponseBodySchema = z.infer<
  typeof refreshAuthenticationResponseBodySchema
>
