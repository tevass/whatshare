import { z } from 'zod'

export const wssNamespace = z.enum(['wa'])

export type WssNamespace = z.infer<typeof wssNamespace>
