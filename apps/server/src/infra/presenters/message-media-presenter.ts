import { MessageMedia } from '@/domain/chat/enterprise/entities/message-media'
import { HttpMessageMedia } from '@whatshare/http-schemas/entities'
import { WsMessageMedia } from '@whatshare/ws-schemas/entities'

export class MessageMediaPresenter {
  static toHttp(media: MessageMedia): HttpMessageMedia {
    return {
      id: media.id.toString(),
      key: media.key,
      messageId: media.messageId!.toString(),
      mimetype: media.mimetype.toString(),
    }
  }

  static toWs(media: MessageMedia): WsMessageMedia {
    return {
      id: media.id.toString(),
      key: media.key,
      messageId: media.messageId!.toString(),
      mimetype: media.mimetype.toString(),
    }
  }
}
