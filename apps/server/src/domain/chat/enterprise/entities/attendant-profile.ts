import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import type { SetOptional } from 'type-fest'

export interface AttendantProfileProps {
  attendantId: UniqueEntityID | null
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

  static create(
    props: SetOptional<AttendantProfileProps, 'attendantId'>,
    id?: UniqueEntityID,
  ) {
    return new AttendantProfile(
      {
        ...props,
        attendantId: props.attendantId ?? null,
      },
      id,
    )
  }
}
