import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Group, GroupProps } from '@/domain/chat/enterprise/entities/group'
import { faker } from '@faker-js/faker'
import { makeUniqueEntityID } from './make-unique-entity-id'
import { makeWAEntityID } from './make-wa-entity-id'

export const makeGroup = (
  override: Partial<GroupProps> = {},
  id?: UniqueEntityID,
) => {
  return Group.create(
    {
      imageUrl: faker.image.avatar(),
      name: faker.person.firstName(),
      waGroupId: makeWAEntityID(),
      whatsAppId: makeUniqueEntityID(),
      ...override,
    },
    id,
  )
}
