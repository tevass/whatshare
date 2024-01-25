import { MessageType as RawMessageType } from '@prisma/client'
import { MessageType } from '@whatshare/core-schemas/enums'

export class PrismaMessageTypeMapper {
  static toDomain(raw: RawMessageType): MessageType {
    return raw
  }

  static toPrisma(type: MessageType): RawMessageType {
    return type
  }
}
