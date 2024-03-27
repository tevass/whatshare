import { ValueObject } from '@/core/entities/value-object'

export interface AttendantProfileProps {
  email: string
  name: string
  displayName: string
}

export class AttendantProfile extends ValueObject<AttendantProfileProps> {
  get email() {
    return this.props.email
  }

  get name() {
    return this.props.name
  }

  get displayName() {
    return this.props.displayName
  }

  static create(props: AttendantProfileProps) {
    return new AttendantProfile({
      ...props,
    })
  }
}
