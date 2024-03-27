import { WAEntityID } from '@/core/entities/wa-entity-id'
import { PaginationParams } from '@/domain/shared/application/repositories/pagination-params'
import { SearchParams } from '@/domain/shared/application/repositories/search-params'
import { Group } from '../../enterprise/entities/group'

export interface GroupsRepositoryFindByIdParams {
  id: string
}

export interface GroupsRepositoryFindByPhoneParams {
  phone: string
}

export interface GroupsRepositoryFindByWAGroupIdParams {
  waGroupId: WAEntityID
}

export interface GroupsRepositoryFindManyByWAGroupsIdsParams {
  waGroupsIds: WAEntityID[]
}

export interface GroupsRepositoryFindManyParams
  extends PaginationParams,
    SearchParams {}

export interface GroupsRepositoryCountManyParams extends SearchParams {}

export abstract class GroupsRepository {
  abstract findManyByWAGroupsIds(
    params: GroupsRepositoryFindManyByWAGroupsIdsParams,
  ): Promise<Group[]>

  abstract createMany(group: Group[]): Promise<void>
}
