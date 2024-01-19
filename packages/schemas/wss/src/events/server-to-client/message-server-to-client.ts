import { z } from 'zod'
import {
  messageChangePayload,
  messageCreatePayload,
  messageRevokedPayload,
} from '../../payloads/message'
import { messageEventName } from '../names'
import { defaultFunction } from '../utils/default-function'

const events = messageEventName.Values

export const messageServerToClientEvents = z.object({
  [events['message:change']]: defaultFunction.args(messageChangePayload),
  [events['message:create']]: defaultFunction.args(messageCreatePayload),
  [events['message:revoked']]: defaultFunction.args(messageRevokedPayload),
})

export type MessageServerToClientEvents = z.infer<
  typeof messageServerToClientEvents
>
