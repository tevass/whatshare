import { z } from 'zod'
import { wssMessage } from '../../entities'

export const messageServerToClientPayload = z.object({
  message: wssMessage,
})

export type messageServerToClientPayload = z.infer<
  typeof messageServerToClientPayload
>
