import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WAEntityID } from '@/core/entities/wa-entity-id'
import type { SetOptional } from 'type-fest'
import { ContactPhone } from './value-objects/contact-phone'

export interface ContactProps {
  waContactId: WAEntityID
  name: string
  phone: ContactPhone
  imageUrl: string | null

  isWAClient: boolean
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

  get isWAClient() {
    return this.props.isWAClient
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
      | 'imageUrl'
      | 'isMyContact'
      | 'isBusiness'
      | 'isEnterprise'
      | 'isGroup'
      | 'isWAClient'
    >,
    id?: UniqueEntityID,
  ) {
    return new Contact(
      {
        ...props,
        imageUrl: props.imageUrl ?? null,
        isWAClient: props.isWAClient ?? false,
        isMyContact: props.isMyContact ?? true,
        isBusiness: props.isBusiness ?? false,
        isEnterprise: props.isEnterprise ?? false,
        isGroup: props.isGroup ?? false,
      },
      id,
    )
  }
}
