import { ValueObject } from '@/core/entities/value-object'

export interface WAMessageMediaProps {
  mimetype: string
  data: string
}

export class WAMessageMedia extends ValueObject<WAMessageMediaProps> {
  get mimetype() {
    return this.props.mimetype
  }

  get data() {
    return this.props.data
  }

  static create(props: WAMessageMediaProps) {
    return new WAMessageMedia(props)
  }
}
