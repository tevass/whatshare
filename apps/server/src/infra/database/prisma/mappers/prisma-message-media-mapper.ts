import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { MessageMedia } from '@/domain/chat/enterprise/entities/message-media'
import { MimeType } from '@/domain/chat/enterprise/entities/value-objects/mime-type'
import { Prisma, Media as PrismaMessageMedia } from '@prisma/client'

export type RawMessageMedia = PrismaMessageMedia

export class PrismaMessageMediaMapper {
  static toDomain(raw: RawMessageMedia): MessageMedia {
    return MessageMedia.create(
      {
        key: raw.key,
        mimetype: MimeType.create(raw.mimetype),
        messageId: raw.messageId ? new UniqueEntityID(raw.messageId) : null,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrismaCreate(media: MessageMedia): Prisma.MediaUncheckedCreateInput {
    return {
      id: media.id.toString(),
      key: media.key,
      mimetype: media.mimetype.toString(),
      messageId: media.messageId?.toString(),
    }
  }
}
