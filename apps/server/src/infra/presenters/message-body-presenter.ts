import { MessageBody } from '@/domain/chat/enterprise/entities/value-objects/message-body'
import { HttpMessageBody } from '@whatshare/http-schemas/entities'
import { WsMessageBody } from '@whatshare/ws-schemas/entities'

export class MessageBodyPresenter {
  static toHttp(body: MessageBody): HttpMessageBody {
    return {
      raw: body.format(),
    }
  }

  static toWs(body: MessageBody): WsMessageBody {
    return {
      raw: body.format(),
    }
  }
}
