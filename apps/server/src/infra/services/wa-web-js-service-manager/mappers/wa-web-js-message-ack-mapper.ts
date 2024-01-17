import { MessageAck } from '@/schemas/core/message-ack'
import { MessageAck as RawMessageAck } from 'whatsapp-web.js'

const domainMapper: { [key in RawMessageAck]: MessageAck } = {
  [RawMessageAck.ACK_ERROR]: 'error',
  [RawMessageAck.ACK_PENDING]: 'pending',
  [RawMessageAck.ACK_SERVER]: 'sent',
  [RawMessageAck.ACK_DEVICE]: 'sent',
  [RawMessageAck.ACK_READ]: 'read',
  [RawMessageAck.ACK_PLAYED]: 'played',
}

export class WAWebJSMessageAckMapper {
  static toDomain(raw: RawMessageAck): MessageAck {
    return domainMapper[raw]
  }
}
