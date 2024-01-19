import { z } from 'zod'

import { chatServerToClientPayload } from '../common'

export const chatCreatePayload = chatServerToClientPayload

export type ChatCreatePayload = z.infer<typeof chatCreatePayload>
