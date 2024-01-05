import { Either, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Message } from '@/domain/chat/enterprise/entities/message'
import { MessageMedia } from '@/domain/chat/enterprise/entities/message-media'
import { MessageBody } from '@/domain/chat/enterprise/entities/value-objects/message-body'
import { MimeType } from '@/domain/chat/enterprise/entities/value-objects/mime-type'
import { Readable } from 'node:stream'
import { ChatEmitter } from '../emitters/chat-emitter'
import { MessageEmitter } from '../emitters/message-emitter'
import { WAChat } from '../entities/wa-chat'
import { WAContact } from '../entities/wa-contact'
import { WAMessage } from '../entities/wa-message'
import { ChatsRepository } from '../repositories/chats-repository'
import { ContactsRepository } from '../repositories/contacts-repository'
import { MessageMediasRepository } from '../repositories/message-medias-repository'
import { MessagesRepository } from '../repositories/messages-repository'
import { Uploader } from '../storage/uploader'

interface HandleWAReceivedMessageRequest {
  waChat: WAChat
  waContact: WAContact
  waMessage: WAMessage
  whatsAppId: string
}

type HandleWAReceivedMessageResponse = Either<
  null,
  {
    message: Message
  }
>

export class HandleWAReceivedMessage {
  constructor(
    private messagesRepository: MessagesRepository,
    private contactsRepository: ContactsRepository,
    private chatsRepository: ChatsRepository,
    private messageMediasRepository: MessageMediasRepository,
    private messageEmitter: MessageEmitter,
    private chatEmitter: ChatEmitter,
    private uploader: Uploader,
  ) {}

  async execute(
    request: HandleWAReceivedMessageRequest,
  ): Promise<HandleWAReceivedMessageResponse> {
    const { waChat, waMessage, whatsAppId, waContact } = request

    let [contact, chat] = await Promise.all([
      waContact.isMyContact
        ? this.contactsRepository.findByWAContactId(waContact.id)
        : null,
      this.chatsRepository.findByWAChatIdAndWhatsAppId(
        {
          whatsAppId,
          waChatId: waChat.id,
        },
        true,
      ),
    ])

    if (!contact) {
      contact = waContact.toContact()
      await this.contactsRepository.create(contact)
    }

    if (!chat) {
      chat = waChat.toChat()

      await this.chatsRepository.create(chat)
      this.chatEmitter.emit({
        event: 'chat:create',
        data: {
          chat,
        },
      })
    }

    const messageBody = waMessage.body
      ? MessageBody.create({ content: waMessage.body })
      : null

    const message = Message.create({
      waChatId: chat.waChatId,
      chatId: chat.id,
      type: waMessage.type,
      waMessageId: waMessage.id,
      whatsAppId: new UniqueEntityID(whatsAppId),
      ack: waMessage.ack,
      author: chat.contact ?? contact,
      body: messageBody,
      isBroadcast: waMessage.isBroadcast,
      isForwarded: waMessage.isForwarded,
      isGif: waMessage.isGif,
      isStatus: waMessage.isStatus,
      isFromMe: waMessage.isFromMe,
    })

    if (waMessage.hasQuoted()) {
      const waQuotedMessage = waMessage.quoted

      const quotedMessage = await this.messagesRepository.findByWAMessageId(
        waQuotedMessage.id,
        true,
      )

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

      const myContacts = await this.contactsRepository.findManyByWAContactsIds(
        waContactsThatAreMineIds,
      )

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

    chat.interact(message)
    await this.chatsRepository.save(chat)

    this.messageEmitter.emit({
      event: 'message:create',
      data: {
        message,
      },
    })

    this.chatEmitter.emit({
      event: 'chat:change',
      data: {
        chat,
      },
    })

    return right({
      message,
    })
  }
}
