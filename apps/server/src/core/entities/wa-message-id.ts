import type { OverrideProperties, SetNonNullable, SetOptional } from 'type-fest'
import { UniqueEntityID } from './unique-entity-id'
import { WAEntityID } from './wa-entity-id'
import { WAMessageOwnerID } from './wa-message-owner-id'

export interface WAMessageIDProps {
  entityId: WAEntityID
  isFromMe: boolean
  ref: string
  owner: WAMessageOwnerID | null
}

type GroupMessage = SetNonNullable<WAMessageIDProps, 'owner'>
type PrivateMessage = OverrideProperties<WAMessageIDProps, { owner: null }>

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

  hasOwner(): this is GroupMessage {
    return !!this.owner
  }

  isGroup(): this is GroupMessage {
    return this.hasOwner()
  }

  isPrivate(): this is PrivateMessage {
    return !this.owner
  }

  toString() {
    const isFromMe = String(this.isFromMe)
    const entityId = this.entityId.toString()

    const idParts = [isFromMe, entityId, this.ref]

    if (this.hasOwner()) {
      idParts.push(this.owner.toString())
    }

    const stringId = idParts.join('_')
    return stringId
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
