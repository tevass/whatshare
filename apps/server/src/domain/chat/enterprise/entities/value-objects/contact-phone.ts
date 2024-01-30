import { ValueObject } from '@/core/entities/value-object'
import type { SetOptional } from 'type-fest'

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

  static format(number: string) {
    return number.replace(/^(\d{2})(\d{2})(\d{4,5})(\d{4})$/, '+$1 $2 $3-$4')
  }

  toString() {
    return ContactPhone.format(this.number)
  }

  static create(props: SetOptional<ContactPhoneProps, 'formattedNumber'>) {
    return new ContactPhone({
      ...props,
      formattedNumber:
        props.formattedNumber ?? ContactPhone.format(props.number),
    })
  }
}
