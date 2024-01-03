import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WAMessageID } from '@/core/entities/wa-message-id'
import { ResourceNotFoundError } from '@/domain/shared/application/errors/resource-not-found-error'
import { Message } from '../../enterprise/entities/message'
import { MessageBody } from '../../enterprise/entities/value-objects/message-body'
import { ChatEmitter } from '../emitters/chat-emitter'
import { MessageEmitter } from '../emitters/message-emitter'
import { AttendantsRepository } from '../repositories/attendants-repository'
import { ChatsRepository } from '../repositories/chats-repository'
import { MessagesRepository } from '../repositories/messages-repository'
import { WAService } from '../services/wa-service'
import { WAClientNotFoundError } from './errors/wa-client-not-found-error'

interface HandleSendTextMessageRequest {
  chatId: string
  body: string
  quotedId?: string
  attendantId: string
}

type HandleSendTextMessageResponse = Either<
  ResourceNotFoundError | WAClientNotFoundError,
  {
    message: Message
  }
>

export class HandleSendTextMessage {
  constructor(
    private messagesRepository: MessagesRepository,
    private chatsRepository: ChatsRepository,
    private attendantsRepository: AttendantsRepository,
    private waService: WAService,
    private messageEmitter: MessageEmitter,
    private chatEmitter: ChatEmitter,
  ) {}

  async execute(
    request: HandleSendTextMessageRequest,
  ): Promise<HandleSendTextMessageResponse> {
    const { chatId, attendantId, body, quotedId } = request

    const [chat, attendant, quotedMessage] = await Promise.all([
      this.chatsRepository.findById(chatId),
      this.attendantsRepository.findById(attendantId),
      quotedId ? this.messagesRepository.findById(quotedId) : null,
    ])

    if (!chat) {
      return left(new ResourceNotFoundError(chatId))
    }

    if (!attendant) {
      return left(new ResourceNotFoundError(attendantId))
    }

    const waClient = this.waService.get(chat.whatsAppId.toString())
    if (!waClient) {
      return left(new WAClientNotFoundError(chat.whatsAppId.toString()))
    }

    const tmpWAMessageId = new WAMessageID({
      entityId: chat.waChatId,
      isFromMe: true,
      ref: new UniqueEntityID().toString(),
    })

    const messageBody = MessageBody.create({
      content: body,
      label: attendant.profile.displayName,
    })

    const message = Message.create({
      type: 'text',
      isFromMe: true,
      body: messageBody,
      quoted: quotedMessage,
      waChatId: chat.waChatId,
      chatId: chat.id,
      waMessageId: tmpWAMessageId,
      whatsAppId: chat.whatsAppId,
      senderBy: attendant.profile,
    })

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

    const waMessage = await waClient.message.sendText({
      body: messageBody.toString(),
      chatId: chat.waChatId,
      quotedId: quotedMessage?.waMessageId,
    })

    message.set({
      waMessageId: waMessage.id,
      ack: waMessage.ack,
    })

    await this.messagesRepository.save(message)

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
