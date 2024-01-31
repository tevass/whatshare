import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import type { SetOptional } from 'type-fest'
import { CreateMessageOptionalProps, Message, MessageProps } from './message'
import { PrivateQuotedMessage } from './private-quoted-message'

export interface PrivateMessageProps
  extends MessageProps<PrivateQuotedMessage> {
  isBroadcast: boolean
  isStatus: boolean
}

export class PrivateMessage extends Message<PrivateMessageProps> {
  get isBroadcast() {
    return this.props.isBroadcast
  }

  get isStatus() {
    return this.props.isStatus
  }

  toQuoted(): PrivateQuotedMessage {
    return PrivateQuotedMessage.create({
      body: this.body,
      chatId: this.chatId,
      isFromMe: this.isFromMe,
      isStatus: this.isStatus,
      media: this.media,
      senderBy: this.senderBy,
      type: this.type,
      waChatId: this.waChatId,
      waMessageId: this.waMessageId,
      whatsAppId: this.whatsAppId,
    })
  }

  static create(
    props: SetOptional<
      PrivateMessageProps,
      keyof CreateMessageOptionalProps | 'isBroadcast' | 'isStatus'
    >,
    id?: UniqueEntityID,
  ) {
    return new PrivateMessage(
      {
        ...props,
        isBroadcast: props.isBroadcast ?? false,
        isStatus: props.isStatus ?? false,
      },
      id,
    )
  }
}
