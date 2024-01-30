import { MessageType } from '@whatshare/core-schemas/enums'

export const MESSAGE_MEDIA_TYPES = new Set<MessageType>([
  'image',
  'video',
  'voice',
  'document',
  'sticker',
])
