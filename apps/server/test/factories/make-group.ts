import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { faker } from '@faker-js/faker'
import { makeWAEntityID } from './make-wa-entity-id'
import { Group, GroupProps } from '@/domain/chat/enterprise/entities/group'

export const makeGroup = (
  override: Partial<GroupProps> = {},
  id?: UniqueEntityID,
) => {
  return Group.create(
    {
      imageUrl: faker.image.avatar(),
      name: faker.person.firstName(),
      waGroupId: makeWAEntityID(),
      ...override,
    },
    id,
  )
}
