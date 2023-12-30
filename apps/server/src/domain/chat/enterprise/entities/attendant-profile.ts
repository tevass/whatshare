import { Entity, UniqueEntityID } from '@whatshare/server-core/entities'

export interface AttendantProfileProps {
  attendantId: UniqueEntityID
  email: string
  name: string
  displayName: string
}

export class AttendantProfile extends Entity<AttendantProfileProps> {
  get attendantId() {
    return this.props.attendantId
  }

  get email() {
    return this.props.email
  }

  get name() {
    return this.props.name
  }

  get displayName() {
    return this.props.displayName
  }

  static create(props: AttendantProfileProps, id?: UniqueEntityID) {
    return new AttendantProfile(props, id)
  }
}
