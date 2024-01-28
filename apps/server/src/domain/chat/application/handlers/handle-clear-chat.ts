import { Either, left, right } from '@/core/either'
import { WAEntityID } from '@/core/entities/wa-entity-id'
import { ResourceNotFoundError } from '@/domain/shared/application/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { Chat } from '../../enterprise/entities/chat'
import { ChatEmitter } from '../emitters/chat-emitter'
import { ChatsRepository } from '../repositories/chats-repository'
import { MessagesRepository } from '../repositories/messages-repository'
import { WAClientManager } from '../services/wa-client-manager'
import { WAClientNotFoundError } from './errors/wa-client-not-found-error'

interface HandleClearChatRequest {
  waChatId: string
  whatsAppId: string
}

type HandleClearChatResponse = Either<
  ResourceNotFoundError | WAClientNotFoundError,
  {
    chat: Chat
  }
>

@Injectable()
export class HandleClearChat {
  constructor(
    private chatsRepository: ChatsRepository,
    private messagesRepository: MessagesRepository,
    private waManager: WAClientManager,
    private chatEmitter: ChatEmitter,
  ) {}

  async execute(
    request: HandleClearChatRequest,
  ): Promise<HandleClearChatResponse> {
    const { waChatId, whatsAppId } = request

    const chat = await this.chatsRepository.findByWAChatIdAndWhatsAppId({
      waChatId: WAEntityID.createFromString(waChatId),
      whatsAppId,
    })

    if (!chat) {
      return left(new ResourceNotFoundError(`${waChatId}-${whatsAppId}`))
    }

    const waClient = this.waManager.getConnectedClientById(chat.whatsAppId)
    if (!waClient) {
      return left(new WAClientNotFoundError(chat.whatsAppId.toString()))
    }

    await waClient.chat.clearById(chat.waChatId)
    chat.clear()

    await Promise.all([
      this.messagesRepository.softDeleteManyByChatId({
        chatId: chat.id.toString(),
      }),
      this.chatsRepository.softDelete(chat),
    ])

    this.chatEmitter.emitClear({
      chat,
    })

    return right({
      chat,
    })
  }
}
