import { MessageBody } from '@/domain/chat/enterprise/entities/value-objects/message-body'
import { MessageBody as RawMessageBody } from '@prisma/client'

export class PrismaMessageBodyMapper {
  static toDomain(raw: RawMessageBody): MessageBody {
    return MessageBody.create({
      content: raw.content,
      header: raw.header,
    })
  }

  static toPrisma(body: MessageBody): RawMessageBody {
    return {
      content: body.content,
      header: body.header,
    }
  }
}
