import { UniqueEntityID } from './unique-entity-id'
import { WAContactID } from './wa-contact-id'

// "fromMe": false,
// "remote": "5511955933663@c.us",
// "id": "6C2394955D46A1F0FBC5B124EA1DFF4C",
// "_serialized": "false_5511955933663@c.us_6C2394955D46A1F0FBC5B124EA1DFF4C"

export interface WAMessageIDProps {
  contactId: WAContactID
  isFromMe: boolean
  ref: string
}

export class WAMessageID {
  private props: WAMessageIDProps

  constructor(props: WAMessageIDProps) {
    this.props = props
  }

  get contactId() {
    return this.props.contactId
  }

  get isFromMe() {
    return this.props.isFromMe
  }

  get ref() {
    return this.props.ref
  }

  toString() {
    return `${this.isFromMe}_${this.contactId.toString()}_${this.ref}`
  }

  toUniqueEntityID() {
    return new UniqueEntityID(this.toString())
  }

  equals(id: WAMessageID) {
    return id.toString() === this.toString()
  }

  static createFromString(value: string) {
    const [isFromMe, rawContactId, ref] = value.split('_')

    return new WAMessageID({
      contactId: WAContactID.createFromString(rawContactId),
      isFromMe: isFromMe === 'true',
      ref,
    })
  }
}
