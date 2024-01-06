import { Either, left, right } from '@/core/either'
import { WAEntityID } from '@/core/entities/wa-entity-id'
import { ResourceNotFoundError } from '@/domain/shared/application/errors/resource-not-found-error'
import { Chat } from '../../enterprise/entities/chat'
import { ChatEmitter } from '../emitters/chat-emitter'
import { ChatsRepository } from '../repositories/chats-repository'
import { WAService } from '../services/wa-service'
import { WAClientNotFoundError } from './errors/wa-client-not-found-error'

interface HandleReadChatRequest {
  waChatId: string
  whatsAppId: string
}

type HandleReadChatResponse = Either<
  ResourceNotFoundError | WAClientNotFoundError,
  {
    chat: Chat
  }
>

export class HandleReadChat {
  constructor(
    private chatsRepository: ChatsRepository,
    private waService: WAService,
    private chatEmitter: ChatEmitter,
  ) {}

  async execute(
    request: HandleReadChatRequest,
  ): Promise<HandleReadChatResponse> {
    const { waChatId, whatsAppId } = request

    const chat = await this.chatsRepository.findByWAChatIdAndWhatsAppId({
      waChatId: WAEntityID.createFromString(waChatId),
      whatsAppId,
    })

    if (!chat) {
      return left(new ResourceNotFoundError(`${waChatId}-${whatsAppId}`))
    }

    const waClient = this.waService.get(chat.whatsAppId.toString())
    if (!waClient) {
      return left(new WAClientNotFoundError(chat.whatsAppId.toString()))
    }

    await waClient.chat.sendSeenById(chat.waChatId)

    chat.read()
    await this.chatsRepository.save(chat)

    this.chatEmitter.emit({
      event: 'chat:change',
      data: {
        chat,
      },
    })

    return right({
      chat,
    })
  }
}
