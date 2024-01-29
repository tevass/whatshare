import { Either, left, right } from '@/core/either'
import { WAEntityID } from '@/core/entities/wa-entity-id'
import { Message } from '@/domain/chat/enterprise/entities/message'
import { MessageMedia } from '@/domain/chat/enterprise/entities/message-media'
import { MessageBody } from '@/domain/chat/enterprise/entities/value-objects/message-body'
import { MimeType } from '@/domain/chat/enterprise/entities/value-objects/mime-type'
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
    private contactsRepository: ContactsRepository,
    private chatsRepository: ChatsRepository,
    private messageMediasRepository: MessageMediasRepository,
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
      ? MessageBody.create({ content: waMessage.body })
      : null

    const message = Message.create({
      waChatId: chat.waChatId,
      chatId: chat.id,
      type: waMessage.type,
      waMessageId: waMessage.id,
      whatsAppId: chat.whatsAppId,
      ack: waMessage.ack,
      author: chat.contact,
      body: messageBody,
      isBroadcast: waMessage.isBroadcast,
      isForwarded: waMessage.isForwarded,
      isGif: waMessage.isGif,
      isStatus: waMessage.isStatus,
      isFromMe: waMessage.isFromMe,
      createdAt: this.dateAdapter.fromUnix(waMessage.timestamp).toDate(),
      waMentionsIds: waMessage.mentionedIds,
    })

    if (waMessage.hasQuoted()) {
      const waQuotedMessage = waMessage.quoted

      const quotedMessage = await this.messagesRepository.findByWAMessageId({
        waMessageId: waQuotedMessage.id,
      })

      if (quotedMessage) message.set({ quoted: quotedMessage })
    }

    if (waMessage.hasContacts()) {
      const [waContactsThatAreMine, waMyContactsThatAreNotMineYet] = [
        waMessage.contacts.filter((waContact) => waContact.isMyContact),
        waMessage.contacts.filter((waContact) => !waContact.isMyContact),
      ]

      const waContactsThatAreMineIds = waContactsThatAreMine.map(
        (waContact) => waContact.id,
      )

      const myContacts = await this.contactsRepository.findManyByWAContactsIds({
        waContactsIds: waContactsThatAreMineIds,
      })

      const contactsAteMineButNotExists = waContactsThatAreMine.filter(
        (waContact) => {
          return !myContacts.find((contact) =>
            contact.waContactId.equals(waContact.id),
          )
        },
      )

      const contactsToCreate = waMyContactsThatAreNotMineYet
        .concat(contactsAteMineButNotExists)
        .map((waContact) => waContact.toContact())

      await this.contactsRepository.createMany(contactsToCreate)

      const contacts = myContacts.concat(contactsToCreate)

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
