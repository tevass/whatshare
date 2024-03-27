import type { MessageType } from '@whatshare/core'

export const MESSAGE_MEDIA_TYPES = new Set<MessageType>([
  'image',
  'video',
  'voice',
  'document',
  'sticker',
])
