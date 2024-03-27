import { Either, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Group } from '@/domain/chat/enterprise/entities/group'
import { Injectable } from '@nestjs/common'
import { WAContact } from '../../entities/wa-contact'
import { GroupsRepository } from '../../repositories/groups-repository'

interface CreateGroupsFromWaContactsUseCaseRequest {
  waContacts: WAContact[]
  whatsAppId: string
}

type CreateGroupsFromWaContactsUseCaseResponse = Either<
  null,
  {
    groups: Group[]
  }
>

@Injectable()
export class CreateGroupsFromWaContactsUseCase {
  constructor(private groupsRepository: GroupsRepository) {}

  async execute(
    request: CreateGroupsFromWaContactsUseCaseRequest,
  ): Promise<CreateGroupsFromWaContactsUseCaseResponse> {
    const { waContacts, whatsAppId } = request

    const onlyGroups = waContacts.filter((waContact) => waContact.isGroup)
    const groupsIds = onlyGroups.map((waContact) => waContact.id)

    const myGroups = await this.groupsRepository.findManyByWAGroupsIds({
      waGroupsIds: groupsIds,
    })

    myGroups.forEach((group) => {
      const waContact = onlyGroups.find((waContact) =>
        waContact.id.equals(group.waGroupId),
      )

      if (!waContact) return

      group.set({
        imageUrl: waContact.imageUrl,
        name: waContact.name ?? group.name,
      })
    })

    const groupsToCreate = onlyGroups
      .filter(
        (waContact) =>
          !myGroups.some((group) => group.waGroupId.equals(waContact.id)),
      )
      .map((waContact) => waContact.toGroup())

    groupsToCreate.forEach((group) =>
      group.set({ whatsAppId: new UniqueEntityID(whatsAppId) }),
    )

    await this.groupsRepository.createMany(groupsToCreate)

    const groups = myGroups.concat(groupsToCreate)

    return right({ groups })
  }
}
