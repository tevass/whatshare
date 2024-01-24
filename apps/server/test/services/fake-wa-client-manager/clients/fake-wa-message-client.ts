import { WAEntityID } from '@/core/entities/wa-entity-id'
import { WAMessage } from '@/domain/chat/application/entities/wa-message'
import {
  WAMessageClient,
  WAMessageSendTextParams,
} from '@/domain/chat/application/services/wa-client-manager/clients/wa-message-client'
import { makeWAMessage } from '@/test/factories/make-wa-message'
import { makeWAMessageID } from '@/test/factories/make-wa-message-id'

export class FakeWAMessageClient implements WAMessageClient {
  messages: WAMessage[] = []

  async sendText(params: WAMessageSendTextParams): Promise<WAMessage> {
    const { body, chatId, quotedId } = params

    const message = makeWAMessage(
      {
        body,
        chatId,
        ...(quotedId && {
          quoted: makeWAMessage({}, quotedId),
        }),
        isFromMe: true,
        ack: 'sent',
        contacts: [],
        isBroadcast: false,
        isForwarded: false,
        isGif: false,
        isStatus: false,
        media: null,
        type: 'text',
      },
      makeWAMessageID({ entityId: chatId, isFromMe: true }),
    )

    this.messages.push(message)

    return message
  }

  async getManyByChatId(chatId: WAEntityID): Promise<WAMessage[]> {
    return this.messages.filter((item) => item.chatId.equals(chatId))
  }
}
