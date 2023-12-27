import type { SetOptional } from 'type-fest'
import { UniqueEntityID } from './unique-entity-id'

export type WAContactIDServer = 'us'
export type WAContactIDType = 'c' | 'g'

export interface WAContactIDProps {
  server: WAContactIDServer
  number: string
  type: WAContactIDType
}

export class WAContactID {
  private props: WAContactIDProps

  constructor(props: SetOptional<WAContactIDProps, 'server' | 'type'>) {
    this.props = {
      ...props,
      server: props.server ?? 'us',
      type: props.type ?? 'c',
    }
  }

  get server() {
    return this.props.server
  }

  get number() {
    return this.props.number
  }

  get type() {
    return this.props.type
  }

  toString() {
    return `${this.number}@${this.type}.${this.server}`
  }

  toUniqueEntityID() {
    return new UniqueEntityID(this.toString())
  }

  equals(id: WAContactID) {
    return id.toString() === this.toString()
  }

  static createFromString(value: string) {
    const [waNumber, waParams] = value.split('@')
    const [type, server] = waParams.split('.') as [
      WAContactIDType,
      WAContactIDServer,
    ]

    const number = waNumber.replaceAll(':', '').trim()

    return new WAContactID({
      number,
      server,
      type,
    })
  }
}
