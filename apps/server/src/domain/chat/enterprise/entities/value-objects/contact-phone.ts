import { ValueObject } from '@/core/entities/value-object'

export interface ContactPhoneProps {
  number: string
  formattedNumber: string
}

export class ContactPhone extends ValueObject<ContactPhoneProps> {
  get number() {
    return this.props.number
  }

  get formattedNumber() {
    return this.props.formattedNumber
  }

  format() {
    return this.number.replace(
      /^(\d{2})(\d{2})(\d{4,5})(\d{4})$/,
      '+$1 $2 $3-$4',
    )
  }

  static create(props: ContactPhoneProps) {
    return new ContactPhone(props)
  }
}
