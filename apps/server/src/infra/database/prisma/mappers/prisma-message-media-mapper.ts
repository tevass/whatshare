import { Media as PrismaMessageMedia } from '@prisma/client'
import { MessageMedia } from '@/domain/chat/enterprise/entities/message-media'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { MimeType } from '@/domain/chat/enterprise/entities/value-objects/mime-type'

export type RawMessageMedia = PrismaMessageMedia & {
  message: {
    id: string
  } | null
}

export class PrismaMessageMediaMapper {
  static toDomain(raw: RawMessageMedia): MessageMedia {
    return MessageMedia.create(
      {
        key: raw.key,
        mimetype: MimeType.create(raw.mimetype),
        messageId: raw.message ? new UniqueEntityID(raw.message.id) : null,
      },
      new UniqueEntityID(raw.id),
    )
  }
}
