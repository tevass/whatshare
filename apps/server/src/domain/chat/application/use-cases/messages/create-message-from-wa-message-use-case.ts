import { Either, left, right } from '@/core/either'
import { WAEntityID } from '@/core/entities/wa-entity-id'
import { EitherMessage } from '@/domain/chat/enterprise/entities/either-message'
import { GroupMessage } from '@/domain/chat/enterprise/entities/group-message'
import { GroupQuotedMessage } from '@/domain/chat/enterprise/entities/group-quoted-message'
import { CreateMessageProps } from '@/domain/chat/enterprise/entities/message'
import { MessageMedia } from '@/domain/chat/enterprise/entities/message-media'
import { PrivateMessage } from '@/domain/chat/enterprise/entities/private-message'
import { PrivateQuotedMessage } from '@/domain/chat/enterprise/entities/private-quoted-message'
import { MessageBody } from '@/domain/chat/enterprise/entities/value-objects/message-body'
import { MimeType } from '@/domain/chat/enterprise/entities/value-objects/mime-type'
import { ResourceNotFoundError } from '@/domain/shared/application/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { Readable } from 'node:stream'
import { DateAdapter } from '../../adapters/date-adapter'
import { WAMessage } from '../../entities/wa-message'
import { ChatsRepository } from '../../repositories/chats-repository'
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
    message: EitherMessage
  }
>

@Injectable()
export class CreateMessageFromWAMessageUseCase {
  constructor(
    private messagesRepository: MessagesRepository,
    private chatsRepository: ChatsRepository,
    private messageMediasRepository: MessageMediasRepository,
    private createContactsFromWaContacts: CreateContactsFromWaContactsUseCase,
    private uploader: Uploader,
    private dateAdapter: DateAdapter,
  ) {}

  async execute(
    request: CreateMessageFromWAMessageUseCaseRequest,
  ): Promise<CreateMessageFromWAMessageUseCaseResponse> {
    const { waChatId, waMessage, whatsAppId } = request

    const chat = await this.chatsRepository.findByWAChatIdAndWhatsAppId({
      waChatId: WAEntityID.createFromString(waChatId),
      whatsAppId,
    })

    if (!chat) {
      return left(new ResourceNotFoundError(waChatId))
    }

    const messageBody = waMessage.body
      ? MessageBody.create({
          content: waMessage.body,
        })
      : null

    const messageProps: CreateMessageProps = {
      waChatId: chat.value.waChatId,
      whatsAppId: chat.value.whatsAppId,
      chatId: chat.value.id,
      type: waMessage.type,
      waMessageId: waMessage.id,
      ack: waMessage.ack,
      body: messageBody,
      isForwarded: waMessage.isForwarded,
      isGif: waMessage.isGif,
      isFromMe: waMessage.isFromMe,
      createdAt: this.dateAdapter.fromUnix(waMessage.timestamp).toDate(),
    }

    const message = EitherMessage.create(
      chat.isPrivate()
        ? PrivateMessage.create({
            ...messageProps,
            isStatus: waMessage.isStatus,
            isBroadcast: waMessage.isBroadcast,
          })
        : GroupMessage.create({
            ...messageProps,
            author: chat.value.contact,
          }),
    )

    if (waMessage.hasQuoted()) {
      const waQuotedMessage = waMessage.quoted

      const quotedMessage = await this.messagesRepository.findByWAMessageId({
        waMessageId: waQuotedMessage.id,
      })

      if (quotedMessage) {
        message.value.set({
          quoted: quotedMessage.value.toQuoted() as GroupQuotedMessage &
            PrivateQuotedMessage,
        })
      }
    }

    if (waMessage.hasContacts()) {
      const response = await this.createContactsFromWaContacts.execute({
        waContacts: waMessage.contacts,
      })

      const contacts = response.value?.contacts ?? null
      message.value.set({ contacts })
    }

    if (waMessage.hasMentions() && message.isGroup()) {
      const response = await this.createContactsFromWaContacts.execute({
        waContacts: waMessage.mentions,
      })

      const mentions = response.value?.contacts ?? null
      message.value.set({ mentions })
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
        messageId: message.value.id,
      })

      await this.messageMediasRepository.create(messageMedia)

      message.value.set({ media: messageMedia })
    }

    await this.messagesRepository.create(message)

    return right({
      message,
    })
  }
}
