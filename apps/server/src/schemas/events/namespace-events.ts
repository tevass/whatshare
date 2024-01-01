import { z } from 'zod'

export const namespaceEvents = z.enum(['chat', 'admin'])

export type NamespaceEvents = z.infer<typeof namespaceEvents>
