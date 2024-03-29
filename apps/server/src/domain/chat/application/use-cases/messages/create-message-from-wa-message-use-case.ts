import { Either, left, right } from '@/core/either'
import { WAEntityID } from '@/core/entities/wa-entity-id'
import { GroupMessage } from '@/domain/chat/enterprise/entities/group-message'
import { GroupQuotedMessage } from '@/domain/chat/enterprise/entities/group-quoted-message'
import { CreateMessageProps } from '@/domain/chat/enterprise/entities/message'
import { MessageMedia } from '@/domain/chat/enterprise/entities/message-media'
import { PrivateMessage } from '@/domain/chat/enterprise/entities/private-message'
import { PrivateQuotedMessage } from '@/domain/chat/enterprise/entities/private-quoted-message'
import { MessageBody } from '@/domain/chat/enterprise/entities/value-objects/message-body'
import { MimeType } from '@/domain/chat/enterprise/entities/value-objects/mime-type'
import { isPrivateChat } from '@/domain/chat/enterprise/types/chat'
import { Message } from '@/domain/chat/enterprise/types/message'
import { ResourceNotFoundError } from '@/domain/shared/application/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { Readable } from 'node:stream'
import { DateAdapter } from '../../adapters/date-adapter'
import { WAMessage } from '../../entities/wa-message'
import { ChatsRepository } from '../../repositories/chats-repository'
import { ContactsRepository } from '../../repositories/contacts-repository'
import { MessageMediasRepository } from '../../repositories/message-medias-repository'
import { MessagesRepository } from '../../repositories/messages-repository'
import { Uploader } from '../../storage/uploader'
import { CreateContactsFromWaContactsUseCase } from '../contacts/create-contacts-from-wa-contacts-use-case'

interface CreateMessageFromWAMessageUseCaseRequest {
  waMessage: WAMessage
  waChatId: string
  whatsAppId: string
}

type CreateMessageFromWAMessageUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    message: Message
  }
>

@Injectable()
export class CreateMessageFromWAMessageUseCase {
  constructor(
    private messagesRepository: MessagesRepository,
    private chatsRepository: ChatsRepository,
    private contactsRepository: ContactsRepository,
    private messageMediasRepository: MessageMediasRepository,
    private createContactsFromWaContacts: CreateContactsFromWaContactsUseCase,
    private uploader: Uploader,
    private dateAdapter: DateAdapter,
  ) {}

  async execute(
    request: CreateMessageFromWAMessageUseCaseRequest,
  ): Promise<CreateMessageFromWAMessageUseCaseResponse> {
    const { waChatId, waMessage, whatsAppId } = request

    const waChatEntityId = WAEntityID.createFromString(waChatId)

    const [chat, contact] = await Promise.all([
      this.chatsRepository.findByWAChatIdAndWhatsAppId({
        waChatId: waChatEntityId,
        whatsAppId,
      }),
      this.contactsRepository.findByWAContactId({
        waContactId: waChatEntityId,
      }),
    ])

    if (!chat) {
      return left(new ResourceNotFoundError(waChatId))
    }

    const messageBody = waMessage.body
      ? MessageBody.create({
          content: waMessage.body,
        })
      : null

    const messageProps: CreateMessageProps = {
      waChatId: chat.waChatId,
      whatsAppId: chat.whatsAppId,
      chatId: chat.id,
      type: waMessage.type,
      waMessageId: waMessage.id,
      ack: waMessage.ack,
      body: messageBody,
      isForwarded: waMessage.isForwarded,
      isGif: waMessage.isGif,
      isFromMe: waMessage.isFromMe,
      createdAt: this.dateAdapter.fromUnix(waMessage.timestamp).toDate(),
    }

    let message: Message

    if (isPrivateChat(chat)) {
      message = PrivateMessage.create({
        ...messageProps,
        isStatus: waMessage.isStatus,
        isBroadcast: waMessage.isBroadcast,
      })
    } else {
      if (!contact) {
        return left(new ResourceNotFoundError(waChatId))
      }

      message = GroupMessage.create({
        ...messageProps,
        author: contact,
      })
    }

    if (waMessage.hasQuoted()) {
      const waQuotedMessage = waMessage.quoted

      const quotedMessage = await this.messagesRepository.findByWAMessageId({
        waMessageId: waQuotedMessage.id,
      })

      if (quotedMessage) {
        message.set({
          quoted: quotedMessage.toQuoted() as GroupQuotedMessage &
            PrivateQuotedMessage,
        })
      }
    }

    if (waMessage.hasContacts()) {
      const response = await this.createContactsFromWaContacts.execute({
        waContacts: waMessage.contacts,
      })

      const contacts = response?.value?.contacts ?? null
      message.set({ contacts })
    }

    if (waMessage.hasMedia()) {
      const media = waMessage.media

      const mimetype = MimeType.create(media.mimetype)
      const ext = mimetype.extension()

      const waMessageIdRef = waMessage.id.ref
      const fileName = `${waMessageIdRef}.${ext}`

      const { url: mediaKey } = await this.uploader.upload({
        fileName,
        mimetype,
        body: Readable.from(Buffer.from(media.data, 'base64')),
      })

      const messageMedia = MessageMedia.create({
        mimetype,
        key: mediaKey,
        messageId: message.id,
      })

      await this.messageMediasRepository.create(messageMedia)

      message.set({ media: messageMedia })
    }

    await this.messagesRepository.create(message)

    return right({
      message,
    })
  }
}
