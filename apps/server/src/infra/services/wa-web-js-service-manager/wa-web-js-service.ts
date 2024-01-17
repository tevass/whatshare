import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WAChatService } from '@/domain/chat/application/services/wa-chat-service'
import { WAContactService } from '@/domain/chat/application/services/wa-contact-service'
import { WAMessageService } from '@/domain/chat/application/services/wa-message-service'
import { WAService } from '@/domain/chat/application/services/wa-service'
import { WhatsAppStatus } from '@/schemas/core/whats-app-status'
import type { SetOptional } from 'type-fest'
import { Client } from 'whatsapp-web.js'
import { WAWebJSChatService } from './services/wa-web-js-chat'
import { WAWebJSContactService } from './services/wa-web-js-contact'
import { WAWebJSMessageService } from './services/wa-web-js-message'

interface WAWebJSServiceProps {
  whatsAppId: UniqueEntityID
  status: WhatsAppStatus
  raw: Client
}

interface WAWebJSServices {
  chat: WAChatService
  message: WAMessageService
  contact: WAContactService
}

export class WAWebJSService extends WAService {
  private props: WAWebJSServiceProps
  private services: WAWebJSServices

  protected constructor(props: WAWebJSServiceProps) {
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

  destroy() {
    return this.raw.destroy()
  }

  async disconnect() {
    await this.raw.logout()
    this.props.status = 'disconnected'
  }

  static create(props: SetOptional<WAWebJSServiceProps, 'status'>) {
    return new WAWebJSService({
      ...props,
      status: props.status ?? 'disconnected',
    })
  }
}
