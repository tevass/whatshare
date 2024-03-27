import { Either, left, right } from '@/core/either'
import { Attendant } from '@/domain/chat/enterprise/entities/attendant'
import { AttendantWhatsAppList } from '@/domain/chat/enterprise/entities/attendant-whats-app-list'
import { HashGenerator } from '../../cryptography/hash-generator'
import { AttendantsRepository } from '../../repositories/attendants-repository'
import { AttendantAlreadyExistsError } from '../errors/attendant-already-exists-error'
import { WhatsAppsRepository } from '../../repositories/whats-apps-repository'
import { AttendantProfile } from '@/domain/chat/enterprise/entities/value-objects/attendant-profile'

interface CreateAttendantUseCaseRequest {
  email: string
  name: string
  displayName: string
  password: string
  whatsAppsIds: string[]
}

type CreateAttendantUseCaseResponse = Either<
  AttendantAlreadyExistsError,
  {
    attendant: Attendant
  }
>

export class CreateAttendantUseCase {
  constructor(
    private attendantsRepository: AttendantsRepository,
    private whatsAppsRepository: WhatsAppsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute(
    request: CreateAttendantUseCaseRequest,
  ): Promise<CreateAttendantUseCaseResponse> {
    const { displayName, email, name, password, whatsAppsIds } = request

    const attendantWithSameEmail = await this.attendantsRepository.findByEmail({
      email,
    })

    if (attendantWithSameEmail) {
      return left(new AttendantAlreadyExistsError(email))
    }

    const [whatsApps, hashedPassword] = await Promise.all([
      this.whatsAppsRepository.findManyByIds({ ids: whatsAppsIds }),
      this.hashGenerator.hash(password),
    ])

    const profile = AttendantProfile.create({
      displayName,
      email,
      name,
    })

    const attendant = Attendant.create({
      profile,
      password: hashedPassword,
      whatsAppsList: AttendantWhatsAppList.create(whatsApps),
    })

    await this.attendantsRepository.create(attendant)

    return right({
      attendant,
    })
  }
}
