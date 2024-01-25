import { MessageAck as RawMessageAck } from '@prisma/client'
import { MessageAck } from '@whatshare/core-schemas/enums'

export class PrismaMessageAckMapper {
  static toDomain(raw: RawMessageAck): MessageAck {
    return raw
  }

  static toPrisma(ack: MessageAck): RawMessageAck {
    return ack
  }
}
