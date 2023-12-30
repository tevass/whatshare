import {
  Entity,
  UniqueEntityID,
  WAEntityID,
} from '@whatshare/server-core/entities'
import type { SetOptional } from 'type-fest'
import { ContactPhone } from './value-objects/contact-phone'

export interface ContactProps {
  waContactId: WAEntityID
  name: string
  phone: ContactPhone
  imageUrl: string | null

  isGroup: boolean
  isBusiness: boolean
  isEnterprise: boolean
  isMyContact: boolean
}

export class Contact extends Entity<ContactProps> {
  get waContactId() {
    return this.props.waContactId
  }

  get name() {
    return this.props.name
  }

  get phone() {
    return this.props.phone
  }

  get imageUrl() {
    return this.props.imageUrl
  }

  get isGroup() {
    return this.props.isGroup
  }

  get isBusiness() {
    return this.props.isBusiness
  }

  get isEnterprise() {
    return this.props.isEnterprise
  }

  get isMyContact() {
    return this.props.isMyContact
  }

  get isUnknown() {
    return !this.isMyContact
  }

  static create(
    props: SetOptional<
      ContactProps,
      'imageUrl' | 'isMyContact' | 'isBusiness' | 'isEnterprise' | 'isGroup'
    >,
    id?: UniqueEntityID,
  ) {
    return new Contact(
      {
        ...props,
        imageUrl: props.imageUrl ?? null,
        isMyContact: props.isMyContact ?? true,
        isBusiness: props.isBusiness ?? false,
        isEnterprise: props.isEnterprise ?? false,
        isGroup: props.isGroup ?? false,
      },
      id,
    )
  }
}
