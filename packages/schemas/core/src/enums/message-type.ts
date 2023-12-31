import { z } from 'zod'

export const messageType = z.enum([
  'text',
  'audio',
  'voice',
  'image',
  'video',
  'document',
  'sticker',
  'vcard',
  'multi_vcard',
  'revoked',
  'unknown',
])

export type MessageType = z.infer<typeof messageType>
