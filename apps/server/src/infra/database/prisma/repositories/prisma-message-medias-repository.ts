import { MessageMediasRepository } from '@/domain/chat/application/repositories/message-medias-repository'
import { PrismaService } from '../prisma.service'
import { MessageMedia } from '@/domain/chat/enterprise/entities/message-media'
import { PrismaMessageMediaMapper } from '../mappers/prisma-message-media-mapper'

export class PrismaMessageMediasRepository implements MessageMediasRepository {
  constructor(private prisma: PrismaService) {}

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
}
