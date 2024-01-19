import { z } from 'zod'

import { messageServerToClientPayload } from '../common'

export const messageCreatePayload = messageServerToClientPayload

export type MessageCreatePayload = z.infer<typeof messageCreatePayload>
