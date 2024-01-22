import { WAMessageMedia } from '@/domain/chat/application/entities/value-objects/wa-message-media'
import { MessageMedia as RawMessageMedia } from 'whatsapp-web.js'

export class WAWebJSMessageMediaMapper {
  static toDomain(raw: RawMessageMedia): WAMessageMedia {
    return WAMessageMedia.create({
      data: raw.data,
      mimetype: raw.mimetype,
    })
  }
}
