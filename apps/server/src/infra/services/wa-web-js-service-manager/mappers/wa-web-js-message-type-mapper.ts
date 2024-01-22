import type { MessageType } from '@whatshare/core-schemas/enums'
import { MessageTypes as RawMessageType } from 'whatsapp-web.js'

const domainMapper: Partial<{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [key in RawMessageType]: MessageType
}> = {
  [RawMessageType.AUDIO]: 'audio',
  [RawMessageType.DOCUMENT]: 'document',
  [RawMessageType.IMAGE]: 'image',
  [RawMessageType.CONTACT_CARD_MULTI]: 'multi_vcard',
  [RawMessageType.REVOKED]: 'revoked',
  [RawMessageType.STICKER]: 'sticker',
  [RawMessageType.TEXT]: 'text',
  [RawMessageType.UNKNOWN]: 'unknown',
  [RawMessageType.CONTACT_CARD]: 'vcard',
  [RawMessageType.VIDEO]: 'video',
  [RawMessageType.VOICE]: 'voice',
}

export class WAWebJSMessageTypeMapper {
  static toDomain(raw: RawMessageType): MessageType {
    return domainMapper[raw] ?? 'unknown'
  }
}
