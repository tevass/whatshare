import { WAChatService } from '@/domain/chat/application/services/wa-chat-service'
import { WAContactService } from '@/domain/chat/application/services/wa-contact-service'
import { WAMessageService } from '@/domain/chat/application/services/wa-message-service'
import { WAService } from '@/domain/chat/application/services/wa-service'
import type { SetOptional } from 'type-fest'
import { Client } from 'whatsapp-web.js'
import { WWJSChatService } from './services/wwjs-chat-service'
import { WWJSContactService } from './services/wwjs-contact-service'
import { WWJSMessageService } from './services/wwjs-message-service'
import { WhatsAppProps } from '@/domain/chat/enterprise/entities/whats-app'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface WWJSClientProps extends WhatsAppProps {
  raw: Client
}

export class WWJSClient extends WAService {
  private raw: Client
  chat: WAChatService
  message: WAMessageService
  contact: WAContactService

  protected constructor(
    { raw, ...props }: WWJSClientProps,
    id: UniqueEntityID,
  ) {
    super(props, id)

    this.raw = raw
    this.chat = WWJSChatService.create(this)
    this.message = WWJSMessageService.create(this)
    this.contact = WWJSContactService.create(this)
  }

  switchToRaw() {
    return this.raw
  }

  init() {
    return this.raw.initialize()
  }

  close() {
    return this.raw.destroy()
  }

  logout() {
    return this.raw.logout()
  }

  static create(
    props: SetOptional<WWJSClientProps, 'status'>,
    id: UniqueEntityID,
  ) {
    return new WWJSClient(
      {
        ...props,
        status: props.status ?? 'disconnected',
      },
      id,
    )
  }
}
