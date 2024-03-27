import {
  GroupsRepository,
  GroupsRepositoryFindManyByWAGroupsIdsParams,
} from '@/domain/chat/application/repositories/groups-repository'
import { Group } from '@/domain/chat/enterprise/entities/group'

export class InMemoryGroupsRepository implements GroupsRepository {
  items: Group[] = []

  async findManyByWAGroupsIds(
    params: GroupsRepositoryFindManyByWAGroupsIdsParams,
  ): Promise<Group[]> {
    const { waGroupsIds } = params

    const groups = this.items.filter((item) =>
      waGroupsIds
        .map((item) => item.toString())
        .includes(item.waGroupId.toString()),
    )

    return groups
  }

  async createMany(entities: Group[]): Promise<void> {
    this.items.push(...entities)
  }
}
