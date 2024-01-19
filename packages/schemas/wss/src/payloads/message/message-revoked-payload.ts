import { z } from 'zod'

import { messageServerToClientPayload } from '../common'

export const messageRevokedPayload = messageServerToClientPayload

export type MessageRevokedPayload = z.infer<typeof messageRevokedPayload>
