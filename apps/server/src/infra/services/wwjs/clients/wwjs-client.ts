import type { SetOptional } from 'type-fest'
import WWJS from 'whatsapp-web.js'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  WAClient,
  WAClientProps,
} from '@/domain/chat/application/services/wa-client-manager/clients/wa-client'
import { WhatsApp } from '@/domain/chat/enterprise/entities/whats-app'
import { WWJSHandler } from '../wwjs-handler'
import { WWJSChatClient } from './wwjs-chat-client'
import { WWJSContactClient } from './wwjs-contact-client'
import { WWJSMessageClient } from './wwjs-message-client'

interface WWJSClientProps extends WAClientProps {
  raw: WWJS.Client
}

export class WWJSClient extends WAClient<WWJSClientProps> {
  chat: WWJSChatClient
  message: WWJSMessageClient
  contact: WWJSContactClient

  protected constructor(props: WWJSClientProps, id: UniqueEntityID) {
    super(props, id)

    this.chat = WWJSChatClient.create(this)
    this.message = WWJSMessageClient.create(this)
    this.contact = WWJSContactClient.create(this)
  }

  private get raw() {
    return this.props.raw
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

  addHandlers(handlers: WWJSHandler[]) {
    handlers.forEach((handler) => {
      this.raw.on(handler.event, handler.register(this))
    })
  }

  setFromWhatsApp(whatsapp: WhatsApp) {
    this.set({
      name: whatsapp.name,
      status: whatsapp.status,
    })
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
