import { Entity, UniqueEntityID } from '@whatshare/server-core/entities'
import type { SetNonNullable, SetOptional } from 'type-fest'
import { AttendantProfile } from './attendant-profile'
import { AttendantWhatsAppList } from './attendant-whats-app-list'

export interface AttendantProps {
  profile: AttendantProfile
  password: string | null
  whatsAppsList: AttendantWhatsAppList
}

type AttendantHasPassword = SetNonNullable<AttendantProps, 'password'>

export class Attendant extends Entity<AttendantProps> {
  get profile() {
    return this.props.profile
  }

  get password() {
    return this.props.password
  }

  hasPassword(): this is AttendantHasPassword {
    return !!this.password
  }

  get whatsAppsList() {
    return this.props.whatsAppsList
  }

  static create(
    props: SetOptional<AttendantProps, 'password' | 'whatsAppsList'>,
    id?: UniqueEntityID,
  ) {
    return new Attendant(
      {
        ...props,
        password: props.password ?? null,
        whatsAppsList: props.whatsAppsList ?? AttendantWhatsAppList.create([]),
      },
      id,
    )
  }
}
