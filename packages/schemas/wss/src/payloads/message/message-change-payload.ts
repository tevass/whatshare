import { z } from 'zod'

import { messageServerToClientPayload } from '../common'

export const messageChangePayload = messageServerToClientPayload

export type MessageChangePayload = z.infer<typeof messageChangePayload>
