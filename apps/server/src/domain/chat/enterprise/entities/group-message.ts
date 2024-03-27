import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import type { SetOptional } from 'type-fest'
import { Contact } from './contact'
import { GroupQuotedMessage } from './group-quoted-message'
import { CreateMessageOptionalProps, Message, MessageProps } from './message'

export interface GroupMessageProps extends MessageProps<GroupQuotedMessage> {
  author: Contact
}

export class GroupMessage extends Message<GroupMessageProps> {
  get author() {
    return this.props.author
  }

  toQuoted(): GroupQuotedMessage {
    return GroupQuotedMessage.create({
      body: this.body,
      chatId: this.chatId,
      isFromMe: this.isFromMe,
      media: this.media,
      senderBy: this.senderBy,
      type: this.type,
      waChatId: this.waChatId,
      waMessageId: this.waMessageId,
      whatsAppId: this.whatsAppId,
      author: this.author,
    })
  }

  static create(
    props: SetOptional<GroupMessageProps, keyof CreateMessageOptionalProps>,
    id?: UniqueEntityID,
  ) {
    return new GroupMessage({ ...props }, id)
  }
}
