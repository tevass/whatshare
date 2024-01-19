import { z } from 'zod'

export const namespaceEvents = z.enum(['wa'])

export type NamespaceEvents = z.infer<typeof namespaceEvents>
