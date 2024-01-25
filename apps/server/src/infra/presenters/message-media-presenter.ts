import { MessageMedia } from '@/domain/chat/enterprise/entities/message-media'
import { WsMessageMedia } from '@whatshare/ws-schemas/entities'

export class MessageMediaPresenter {
  static toWs(media: MessageMedia): WsMessageMedia {
    return {
      id: media.id.toString(),
      key: media.key,
      messageId: media.messageId!.toString(),
      mimetype: media.mimetype.toString(),
    }
  }
}
