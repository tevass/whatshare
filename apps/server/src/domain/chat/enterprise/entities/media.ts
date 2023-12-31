import { Entity } from '@/core/entities/entity'
import { MimeType } from './value-objects/mime-type'

export interface MediaProps {
  filename: string
  key: string
  url: string
  mimetype: MimeType
}

export abstract class Media<Props extends MediaProps> extends Entity<Props> {
  get filename() {
    return this.props.filename
  }

  get key() {
    return this.props.key
  }

  get url() {
    return this.props.url
  }

  get mimetype() {
    return this.props.mimetype
  }
}
