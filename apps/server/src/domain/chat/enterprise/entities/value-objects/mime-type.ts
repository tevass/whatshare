import { ValueObject } from '@/core/entities/value-object'
import mime from 'mime-types'

export class MimeType extends ValueObject<string> {
  get value() {
    return this.props
  }

  extension() {
    return mime.extension(this.value) || 'unknown'
  }

  toString() {
    return this.value
  }

  static createFromFilename(filename: string) {
    const mimetype = mime.lookup(filename)
    if (!mimetype) throw new Error(`Invalid mimetype of "${filename}"`)

    return new MimeType(mimetype)
  }

  static create(value: string) {
    return new MimeType(value)
  }
}
