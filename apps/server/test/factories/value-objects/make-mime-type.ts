import { MimeType } from '@/domain/chat/enterprise/entities/value-objects/mime-type'
import { faker } from '@faker-js/faker'

export function makeMimeType(override?: string) {
  return MimeType.create(override ?? faker.system.mimeType())
}
