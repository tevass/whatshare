import { z } from 'zod'
import { wssChat } from '../../entities'

export const chatServerToClientPayload = z.object({
  chat: wssChat,
})

export type chatServerToClientPayload = z.infer<
  typeof chatServerToClientPayload
>
