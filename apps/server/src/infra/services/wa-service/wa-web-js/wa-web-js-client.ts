import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WAClient } from '@/domain/chat/application/services/wa-service'
import { Except } from 'type-fest'
import WAWebJS from 'whatsapp-web.js'
import { WAWebJSChatMethods } from './methods/wa-web-js-chat-methods'
import { WAWebJSContactMethods } from './methods/wa-web-js-contact-methods'
import { WAWebJSMessageMethods } from './methods/wa-web-js-message-methods'

type WAWebJSClientProps = Except<WAClient, 'id'> & {
  isReady: boolean
}

export class WAWebJSClient
  extends Entity<WAWebJSClientProps>
  implements WAClient
{
  private rawClient: WAWebJS.Client

  protected constructor(rawClient: WAWebJS.Client, id?: UniqueEntityID) {
    super(
      {
        isReady: false,
        chat: WAWebJSChatMethods.create(rawClient),
        message: WAWebJSMessageMethods.create(rawClient),
        contact: WAWebJSContactMethods.create(rawClient),
      },
      id,
    )

    this.rawClient = rawClient

    this.rawClient.on('ready', () => {
      this.set({ isReady: true })
    })
  }

  get chat() {
    return this.props.chat
  }

  get message() {
    return this.props.message
  }

  get contact() {
    return this.props.contact
  }

  get isReady() {
    return this.props.isReady
  }

  switchToRaw() {
    return this.rawClient
  }

  static create(rawClient: WAWebJS.Client, id?: UniqueEntityID) {
    return new WAWebJSClient(rawClient, id)
  }
}
