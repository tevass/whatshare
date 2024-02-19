import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  MessageMedia,
  MessageMediaProps,
} from '@/domain/chat/enterprise/entities/message-media'
import { PrismaMessageMediaMapper } from '@/infra/database/prisma/mappers/prisma-message-media-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
import { makeUniqueEntityID } from './make-unique-entity-id'
import { makeMimeType } from './value-objects/make-mime-type'

export const makeMessageMedia = (
  override: Partial<MessageMediaProps> = {},
  id?: UniqueEntityID,
) => {
  return MessageMedia.create(
    {
      key: faker.string.uuid(),
      messageId: makeUniqueEntityID(),
      mimetype: makeMimeType(),
      ...override,
    },
    id,
  )
}

@Injectable()
export class FakeMessageMediaFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaMessageMedia(
    data: Partial<MessageMediaProps> = {},
    id?: UniqueEntityID,
  ): Promise<MessageMedia> {
    const media = makeMessageMedia({ messageId: null, ...data }, id)

    await this.prisma.media.create({
      data: PrismaMessageMediaMapper.toPrismaCreate(media),
    })

    return media
  }
}
