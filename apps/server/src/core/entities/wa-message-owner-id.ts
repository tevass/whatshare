import { WAEntityID } from './wa-entity-id'

export interface WAMessageOwnerIDProps {
  entityId: WAEntityID
  ref: string
}

export class WAMessageOwnerID {
  protected props: WAMessageOwnerIDProps

  constructor(props: WAMessageOwnerIDProps) {
    this.props = {
      ...props,
    }
  }

  get entityId() {
    return this.props.entityId
  }

  get ref() {
    return this.props.ref
  }

  get itsSelf() {
    return this.ref === 'out'
  }

  toString() {
    const ownerIsNotEntityId = this.ref !== 'out'

    if (ownerIsNotEntityId) {
      return WAEntityID.createFromString(this.ref).toString()
    }

    return this.ref
  }

  static create(props: WAMessageOwnerIDProps) {
    return new WAMessageOwnerID(props)
  }
}
