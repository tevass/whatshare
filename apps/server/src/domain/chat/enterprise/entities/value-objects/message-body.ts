import { ValueObject } from '@/core/entities/value-object'
import { WAEntityID } from '@/core/entities/wa-entity-id'
import type { SetNonNullable, SetOptional } from 'type-fest'

export interface MessageBodyProps {
  header: string | null
  content: string
  waMentionsIds: WAEntityID[] | null
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

  get waMentionsIds() {
    return this.props.waMentionsIds
  }

  hasMentions(): this is SetNonNullable<MessageBodyProps, 'waMentionsIds'> {
    return !!this.waMentionsIds?.length
  }

  format() {
    const partsOfContent = [this.content]

    if (this.hasHeader()) partsOfContent.unshift(this.header)
    const body = partsOfContent.join('\n')

    return body
  }

  static create(
    props: SetOptional<MessageBodyProps, 'header' | 'waMentionsIds'>,
  ) {
    return new MessageBody({
      ...props,
      header: props.header ?? null,
      waMentionsIds: props.waMentionsIds ?? null,
    })
  }
}
