import { WAMessage } from '@/domain/chat/application/entities/wa-message'
import {
  WAMessageService,
  WAMessageServiceSendTextParams,
} from '@/domain/chat/application/services/wa-message-service'
import { makeWAMessage } from '../factories/make-wa-message'
import { makeWAMessageID } from '../factories/make-wa-message-id'

export class FakeWAMessageService implements WAMessageService {
  messages: WAMessage[] = []

  async sendText(params: WAMessageServiceSendTextParams): Promise<WAMessage> {
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
}
