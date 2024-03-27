import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  WhatsApp,
  WhatsAppProps,
} from '@/domain/chat/enterprise/entities/whats-app'
import { faker } from '@faker-js/faker'

export const makeWhatsApp = (
  override: Partial<WhatsAppProps> = {},
  id?: UniqueEntityID,
) => {
  return WhatsApp.create(
    {
      name: faker.company.name(),
      ...override,
    },
    id,
  )
}
