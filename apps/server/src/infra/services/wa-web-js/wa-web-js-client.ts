import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WAChatService } from '@/domain/chat/application/services/wa-chat-service'
import { WAContactService } from '@/domain/chat/application/services/wa-contact-service'
import { WAMessageService } from '@/domain/chat/application/services/wa-message-service'
import { WAService } from '@/domain/chat/application/services/wa-service'
import type { WhatsAppStatus } from '@whatshare/core-schemas/enums'
import type { SetOptional } from 'type-fest'
import { Client } from 'whatsapp-web.js'
import { WAWebJSChatService } from './services/wa-web-js-chat'
import { WAWebJSContactService } from './services/wa-web-js-contact'
import { WAWebJSMessageService } from './services/wa-web-js-message'

interface WAWebJSClientProps {
  whatsAppId: UniqueEntityID
  status: WhatsAppStatus
  raw: Client
}

interface WAWebJSServices {
  chat: WAChatService
  message: WAMessageService
  contact: WAContactService
}

export class WAWebJSClient extends WAService {
  private props: WAWebJSClientProps
  private services: WAWebJSServices

  protected constructor(props: WAWebJSClientProps) {
    super()

    this.props = props
    this.services = {
      chat: WAWebJSChatService.create(this),
      message: WAWebJSMessageService.create(this),
      contact: WAWebJSContactService.create(this),
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

  static create(props: SetOptional<WAWebJSClientProps, 'status'>) {
    return new WAWebJSClient({
      ...props,
      status: props.status ?? 'disconnected',
    })
  }
}
