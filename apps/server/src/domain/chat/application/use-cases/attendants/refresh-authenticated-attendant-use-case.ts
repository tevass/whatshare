import { Either, left, right } from '@/core/either'
import { Attendant } from '@/domain/chat/enterprise/entities/attendant'
import { Encrypter } from '../../cryptography/encrypter'
import { AttendantsRepository } from '../../repositories/attendants-repository'
import { ResourceNotFoundError } from '@/domain/common/application/errors/resource-not-found-error'

interface RefreshAuthenticateAttendantUseCaseRequest {
  attendantId: string
}

type RefreshAuthenticateAttendantUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    attendant: Attendant
    accessToken: string
    refreshToken: string
  }
>

export class RefreshAuthenticatedAttendantUseCase {
  constructor(
    private attendantsRepository: AttendantsRepository,
    private encrypter: Encrypter,
  ) {}

  async execute(
    request: RefreshAuthenticateAttendantUseCaseRequest,
  ): Promise<RefreshAuthenticateAttendantUseCaseResponse> {
    const { attendantId } = request

    const attendant = await this.attendantsRepository.findById({
      id: attendantId,
    })

    if (!attendant) {
      return left(new ResourceNotFoundError(attendantId))
    }

    const payload = { sub: attendant.id.toString() }

    const [accessToken, refreshToken] = await Promise.all([
      this.encrypter.encrypt(payload, {
        expiresIn: '1h',
      }),
      this.encrypter.encrypt(
        {},
        {
          expiresIn: '7d',
        },
      ),
    ])

    return right({
      attendant,
      accessToken,
      refreshToken,
    })
  }
}
