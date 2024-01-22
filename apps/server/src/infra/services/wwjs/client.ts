import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WAChatService } from '@/domain/chat/application/services/wa-chat-service'
import { WAContactService } from '@/domain/chat/application/services/wa-contact-service'
import { WAMessageService } from '@/domain/chat/application/services/wa-message-service'
import { WAService } from '@/domain/chat/application/services/wa-service'
import type { WhatsAppStatus } from '@whatshare/core-schemas/enums'
import type { SetOptional } from 'type-fest'
import { Client } from 'whatsapp-web.js'
import { WWJSChatService } from './services/wwjs-chat-service'
import { WWJSContactService } from './services/wwjs-contact-service'
import { WWJSMessageService } from './services/wwjs-message-service'

interface WWJSClientProps {
  whatsAppId: UniqueEntityID
  status: WhatsAppStatus
  raw: Client
}

interface WWJSServices {
  chat: WAChatService
  message: WAMessageService
  contact: WAContactService
}

export class WWJSClient extends WAService {
  private props: WWJSClientProps
  private services: WWJSServices

  protected constructor(props: WWJSClientProps) {
    super()

    this.props = props
    this.services = {
      chat: WWJSChatService.create(this),
      message: WWJSMessageService.create(this),
      contact: WWJSContactService.create(this),
    }
  }

  get whatsAppId() {
    return this.props.whatsAppId
  }

  get status() {
    return this.props.status
  }

  private get raw() {
    return this.props.raw
  }

  switchToRaw() {
    return this.raw
  }

  get chat() {
    return this.services.chat
  }

  get message() {
    return this.services.message
  }

  get contact() {
    return this.services.contact
  }

  init() {
    return this.raw.initialize()
  }

  close() {
    return this.raw.destroy()
  }

  async disconnect() {
    await this.raw.logout()
    this.props.status = 'disconnected'
  }

  static create(props: SetOptional<WWJSClientProps, 'status'>) {
    return new WWJSClient({
      ...props,
      status: props.status ?? 'disconnected',
    })
  }
}
