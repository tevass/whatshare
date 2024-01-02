import { Entity } from '@/core/entities/entity'
import { MimeType } from './value-objects/mime-type'

export interface MediaProps {
  key: string
  mimetype: MimeType
}

export abstract class Media<Props extends MediaProps> extends Entity<Props> {
  get key() {
    return this.props.key
  }

  get mimetype() {
    return this.props.mimetype
  }
}
