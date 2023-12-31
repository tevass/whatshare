import { ValueObject } from '@/core/entities/value-object'
import mime from 'mime'

export class MimeType extends ValueObject<string> {
  get value() {
    return this.props
  }

  static createFromFilename(filename: string) {
    const mimetype = mime.getType(filename)
    if (!mimetype) throw new Error(`Invalid mimetype of "${filename}"`)

    return new MimeType(mimetype)
  }

  static create(value: string) {
    return new MimeType(value)
  }
}
