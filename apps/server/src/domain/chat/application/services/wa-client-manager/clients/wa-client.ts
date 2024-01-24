import { WAChatClient } from './wa-chat-client'
import { WAContactClient } from './wa-contact-client'
import { WAMessageClient } from './wa-message-client'
import { WhatsAppStatus } from '@whatshare/core-schemas/enums'
import { Entity } from '@/core/entities/entity'

export interface WAClientProps {
  name: string
  status: WhatsAppStatus
}

export abstract class WAClient<
  Props extends WAClientProps = WAClientProps,
> extends Entity<Props> {
  abstract chat: WAChatClient
  abstract message: WAMessageClient
  abstract contact: WAContactClient

  get name() {
    return this.props.name
  }

  get status() {
    return this.props.status
  }

  isDisconnected(): this is typeof this & { status: 'disconnected' } {
    return this.status === 'disconnected'
  }

  isConnected(): this is typeof this & { status: 'connected' } {
    return this.status === 'connected'
  }
}
