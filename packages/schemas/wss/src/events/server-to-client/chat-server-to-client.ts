import { z } from 'zod'
import { chatChangePayload, chatCreatePayload } from '../../payloads/chat'
import { chatEventName } from '../names'
import { defaultFunction } from '../utils/default-function'

const events = chatEventName.Values

export const chatServerToClientEvents = z.object({
  [events['chat:change']]: defaultFunction.args(chatChangePayload),
  [events['chat:create']]: defaultFunction.args(chatCreatePayload),
})

export type ChatServerToClientEvents = z.infer<typeof chatServerToClientEvents>
