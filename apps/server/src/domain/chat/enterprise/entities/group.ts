import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WAEntityID } from '@/core/entities/wa-entity-id'
import type { SetNonNullable, SetOptional } from 'type-fest'

export interface GroupProps {
  waGroupId: WAEntityID
  whatsAppId: UniqueEntityID | null
  name: string
  imageUrl: string | null
}

export class Group extends Entity<GroupProps> {
  get waGroupId() {
    return this.props.waGroupId
  }

  get whatsAppId() {
    return this.props.whatsAppId
  }

  hasWhatsAppId(): this is SetNonNullable<GroupProps, 'whatsAppId'> {
    return !!this.whatsAppId
  }

  get name() {
    return this.props.name
  }

  get imageUrl() {
    return this.props.imageUrl
  }

  static create(
    props: SetOptional<GroupProps, 'imageUrl' | 'whatsAppId'>,
    id?: UniqueEntityID,
  ) {
    return new Group(
      {
        ...props,
        imageUrl: props.imageUrl ?? null,
        whatsAppId: props.whatsAppId ?? null,
      },
      id,
    )
  }
}
