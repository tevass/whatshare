import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { MessageMedia } from '@/domain/chat/enterprise/entities/message-media'
import { MimeType } from '@/domain/chat/enterprise/entities/value-objects/mime-type'
import { Prisma, Media as PrismaMessageMedia } from '@prisma/client'

export type RawMessageMedia = PrismaMessageMedia & {
  message:
    | {
        id: string
      }[]
    | null
}

export class PrismaMessageMediaMapper {
  static toDomain(raw: RawMessageMedia): MessageMedia {
    return MessageMedia.create(
      {
        key: raw.key,
        mimetype: MimeType.create(raw.mimetype),
        messageId: raw.message?.[0]
          ? new UniqueEntityID(raw.message[0].id)
          : null,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrismaCreate(media: MessageMedia): Prisma.MediaUncheckedCreateInput {
    return {
      id: media.id.toString(),
      key: media.key,
      mimetype: media.mimetype.toString(),
      message: {
        connect: {
          id: media.messageId?.toString(),
        },
      },
    }
  }
}
