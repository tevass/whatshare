import {
  WAMessageMedia,
  WAMessageMediaProps,
} from '@/domain/chat/application/entities/value-objects/wa-message-media'
import { faker } from '@faker-js/faker'

export function makeWAMessageMedia(override?: Partial<WAMessageMediaProps>) {
  return WAMessageMedia.create({
    data: faker.lorem.paragraph(),
    mimetype: faker.system.mimeType(),
    ...override,
  })
}
