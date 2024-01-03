import { ValueObject } from '@/core/entities/value-object'
import type { SetRequired } from 'type-fest'

export interface MessageBodyProps {
  label?: string
  content: string
}

export class MessageBody extends ValueObject<MessageBodyProps> {
  get label() {
    return this.props.label
  }

  hasLabel(): this is SetRequired<MessageBodyProps, 'label'> {
    return !!this.label?.trim()
  }

  get content() {
    return this.props.content
  }

  format() {
    const partsOfContent = [this.content]

    if (this.hasLabel()) partsOfContent.unshift(this.label)
    const body = partsOfContent.join('\n')

    return body
  }

  toString() {
    return this.format()
  }

  static create(props: MessageBodyProps) {
    return new MessageBody({ ...props })
  }
}
