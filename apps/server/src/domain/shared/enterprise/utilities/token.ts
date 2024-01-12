import { ValueObject } from '@/core/entities/value-object'

interface TokenProps {
  value: string
  expiresAt?: Date
}

export class Token extends ValueObject<TokenProps> {
  get value() {
    return this.props.value
  }

  get expiresAt() {
    return this.props.expiresAt
  }

  static create(props: TokenProps) {
    return new Token(props)
  }
}
