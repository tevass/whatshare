import { z } from 'zod'

export const wsNamespace = z.enum(['wa'])

export type WsNamespace = z.infer<typeof wsNamespace>
