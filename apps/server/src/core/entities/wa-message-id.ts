import type { SetNonNullable, SetOptional } from 'type-fest'
import { UniqueEntityID } from './unique-entity-id'
import { WAEntityID } from './wa-entity-id'
import { WAMessageOwnerID } from './wa-message-owner-id'

export interface WAMessageIDProps {
  entityId: WAEntityID
  isFromMe: boolean
  ref: string
  owner: WAMessageOwnerID | null
}

export class WAMessageID {
  protected props: WAMessageIDProps

  constructor(props: SetOptional<WAMessageIDProps, 'owner'>) {
    this.props = {
      ...props,
      owner: props.owner ?? null,
    }
  }

  get entityId() {
    return this.props.entityId
  }

  get isFromMe() {
    return this.props.isFromMe
  }

  get ref() {
    return this.props.ref
  }

  get owner() {
    return this.props.owner
  }

  hasOwner(): this is SetNonNullable<WAMessageIDProps, 'owner'> {
    return !!this.owner
  }

  toString() {
    const isFromMe = String(this.isFromMe)
    const entityId = this.entityId.toString()

    const idParts = [isFromMe, entityId, this.ref]

    if (this.hasOwner()) {
      idParts.push(this.owner.toString())
    }

    return idParts.join('_')
  }

  toUniqueEntityID() {
    return new UniqueEntityID(this.toString())
  }

  equals(id: WAMessageID) {
    return id.toString() === this.toString()
  }

  static createFromString(value: string) {
    const splittedValue = value.split('_')
    const [isFromMe, rawEntityId, ref, rawOwnerId] = splittedValue

    if (!isFromMe || !rawEntityId || !ref || !rawOwnerId) {
      throw new Error(`Cannot split: "${value}"`)
    }

    const hasOwner = !!rawOwnerId
    const entityId = WAEntityID.createFromString(rawEntityId)

    return new WAMessageID({
      ref,
      entityId,
      isFromMe: isFromMe === 'true',
      ...(hasOwner && {
        owner: WAMessageOwnerID.create({ entityId, ref: rawOwnerId }),
      }),
    })
  }
}
