import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import type { SetNonNullable, SetOptional } from 'type-fest'
import { AttendantProfile } from './attendant-profile'
import { Contact } from './contact'
import { GroupQuotedMessage } from './group-quoted-message'
import { CreateMessageOptionalProps, Message, MessageProps } from './message'

export interface GroupMessageProps extends MessageProps<GroupQuotedMessage> {
  author: Contact
  mentions: Contact[] | null
}

export class GroupMessage extends Message<GroupMessageProps> {
  get author() {
    return this.props.author
  }

  get mentions() {
    return this.props.mentions
  }

  hasMentions(): this is SetNonNullable<GroupMessageProps, 'mentions'> {
    return !!this.mentions?.length
  }

  revoke(by?: AttendantProfile | null) {
    super.revoke(by)
    this.set({ mentions: null })
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
      mentions: this.mentions,
    })
  }

  static create(
    props: SetOptional<
      GroupMessageProps,
      keyof CreateMessageOptionalProps | 'mentions'
    >,
    id?: UniqueEntityID,
  ) {
    return new GroupMessage(
      {
        ...props,
        mentions: props.mentions ?? null,
      },
      id,
    )
  }
}
