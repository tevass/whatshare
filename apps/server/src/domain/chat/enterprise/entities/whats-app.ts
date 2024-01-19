import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import type { WhatsAppStatus } from '@whatshare/core-schemas/enums'
import type { SetOptional } from 'type-fest'

export interface WhatsAppProps {
  name: string
  status: WhatsAppStatus
  qrCode: string | null
}

export class WhatsApp extends Entity<WhatsAppProps> {
  get name() {
    return this.props.name
  }

  get status() {
    return this.props.status
  }

  get qrCode() {
    return this.props.qrCode
  }

  isDisconnected(): this is WhatsAppProps & { status: 'disconnected' } {
    return this.status === 'disconnected'
  }

  isConnected(): this is WhatsAppProps & { status: 'connected' } {
    return this.status === 'connected'
  }

  static create(
    props: SetOptional<WhatsAppProps, 'qrCode' | 'status'>,
    id?: UniqueEntityID,
  ) {
    return new WhatsApp(
      {
        ...props,
        qrCode: props.qrCode ?? null,
        status: props.status ?? 'disconnected',
      },
      id,
    )
  }
}
