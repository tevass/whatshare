import { ValueObject } from '@/core/entities/value-object'
import type { SetNonNullable, SetOptional } from 'type-fest'

export interface MessageBodyProps {
  header: string | null
  content: string
}

export class MessageBody extends ValueObject<MessageBodyProps> {
  get header() {
    return this.props.header
  }

  hasHeader(): this is SetNonNullable<MessageBodyProps, 'header'> {
    return !!this.header?.trim()
  }

  get content() {
    return this.props.content
  }

  format() {
    const partsOfContent = [this.content]

    if (this.hasHeader()) partsOfContent.unshift(this.header)
    const body = partsOfContent.join('\n')

    return body
  }

  static create(props: SetOptional<MessageBodyProps, 'header'>) {
    return new MessageBody({
      ...props,
      header: props.header ?? null,
    })
  }
}
