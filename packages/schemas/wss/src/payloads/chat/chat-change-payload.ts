import { z } from 'zod'

import { chatServerToClientPayload } from '../common'

export const chatChangePayload = chatServerToClientPayload

export type ChatChangePayload = z.infer<typeof chatChangePayload>
