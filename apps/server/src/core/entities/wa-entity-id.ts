import type { SetOptional } from 'type-fest'
import { UniqueEntityID } from './unique-entity-id'

export type WAEntityIDServer = 'us'
export type WAEntityIDType = 'c' | 'g'

export interface WAEntityIDProps {
  server: WAEntityIDServer
  ref: string
  type: WAEntityIDType
}

export class WAEntityID {
  private props: WAEntityIDProps

  constructor(props: SetOptional<WAEntityIDProps, 'server' | 'type'>) {
    this.props = {
      ...props,
      server: props.server ?? 'us',
      type: props.type ?? 'c',
    }
  }

  get server() {
    return this.props.server
  }

  get ref() {
    return this.props.ref
  }

  get type() {
    return this.props.type
  }

  toString() {
    return `${this.ref}@${this.type}.${this.server}`
  }

  toUniqueEntityID() {
    return new UniqueEntityID(this.toString())
  }

  equals(id: WAEntityID) {
    return id.toString() === this.toString()
  }

  static createFromString(value: string) {
    const [waNumber, waParams] = value.split('@')
    if (!waNumber || !waParams) throw new Error(`Cannot split: "${value}"`)

    const [type, server] = waParams.split('.') as [
      WAEntityIDType,
      WAEntityIDServer,
    ]

    const ref = waNumber.replaceAll(':', '').trim()

    return new WAEntityID({
      ref,
      server,
      type,
    })
  }
}
