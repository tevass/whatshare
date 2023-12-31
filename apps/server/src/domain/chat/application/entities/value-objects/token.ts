import { ValueObject } from '@/core/entities/value-object'
import dayjs from 'dayjs'
import type { SetOptional } from 'type-fest'

interface TokenProps {
  name: string
  value: string
  expiresAt: Date | null
}

export class Token extends ValueObject<TokenProps> {
  get name() {
    return this.props.name
  }

  get value() {
    return this.props.value
  }

  get expiresAt() {
    return this.props.expiresAt
  }

  get isExpired() {
    if (!this.expiresAt) return false

    return dayjs(this.expiresAt).isBefore(new Date())
  }

  static create(props: SetOptional<TokenProps, 'expiresAt'>) {
    return new Token({
      ...props,
      expiresAt: props.expiresAt ?? null,
    })
  }
}
