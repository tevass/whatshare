import { httpGroupMessage, httpPrivateMessage } from '@/entities'
import { z } from 'zod'

export const httpMessage = z.union([httpPrivateMessage, httpGroupMessage])

export type HttpMessage = z.infer<typeof httpMessage>
