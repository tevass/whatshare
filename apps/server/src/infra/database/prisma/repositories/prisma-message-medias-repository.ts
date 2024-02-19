import {
  MessageMediasRepository,
  MessageMediasRepositoryFindManyByMessagesIdsParams,
} from '@/domain/chat/application/repositories/message-medias-repository'
import { MessageMedia } from '@/domain/chat/enterprise/entities/message-media'
import { Injectable } from '@nestjs/common'
import { PrismaMessageMediaMapper } from '../mappers/prisma-message-media-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaMessageMediasRepository implements MessageMediasRepository {
  constructor(private prisma: PrismaService) {}

  async findManyByMessagesIds(
    params: MessageMediasRepositoryFindManyByMessagesIdsParams,
  ): Promise<MessageMedia[]> {
    const { messagesIds } = params

    const raw = await this.prisma.media.findMany({
      where: {
        messageId: {
          in: messagesIds,
        },
      },
    })

    return raw.map(PrismaMessageMediaMapper.toDomain)
  }

  async create(media: MessageMedia): Promise<void> {
    const data = PrismaMessageMediaMapper.toPrismaCreate(media)

    await this.prisma.media.create({
      data,
    })
  }

  async delete(media: MessageMedia): Promise<void> {
    await this.prisma.media.delete({
      where: {
        id: media.id.toString(),
      },
    })
  }

  async deleteMany(medias: MessageMedia[]): Promise<void> {
    await this.prisma.media.deleteMany({
      where: {
        id: {
          in: medias.map((media) => media.id.toString()),
        },
      },
    })
  }
}
