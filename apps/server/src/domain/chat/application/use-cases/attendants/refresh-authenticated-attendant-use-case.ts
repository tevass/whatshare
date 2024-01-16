import { Either, left, right } from '@/core/either'
import { Attendant } from '@/domain/chat/enterprise/entities/attendant'
import { ResourceNotFoundError } from '@/domain/shared/application/errors/resource-not-found-error'
import { DateAdapter } from '../../adapters/date-adapter'
import { Encrypter } from '../../cryptography/encrypter'
import { AttendantsRepository } from '../../repositories/attendants-repository'
import { Injectable } from '@nestjs/common'

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

@Injectable()
export class RefreshAuthenticatedAttendantUseCase {
  constructor(
    private attendantsRepository: AttendantsRepository,
    private dateAdapter: DateAdapter,
    private encrypter: Encrypter,
  ) {}

  async execute(
    request: RefreshAuthenticateAttendantUseCaseRequest,
  ): Promise<RefreshAuthenticateAttendantUseCaseResponse> {
    const { attendantId } = request

    const attendant = await this.attendantsRepository.findById(attendantId)

    if (!attendant) {
      return left(new ResourceNotFoundError(attendantId))
    }

    const payload = { sub: attendant.id.toString() }

    const expiresAccessToken = this.dateAdapter.addHours(1)
    const expiresRefreshAccessToken = this.dateAdapter.addDays(7)

    const [accessToken, refreshToken] = await Promise.all([
      this.encrypter.encrypt(payload, {
        expiresIn: expiresAccessToken.toUnix(),
      }),
      this.encrypter.encrypt(payload, {
        expiresIn: expiresRefreshAccessToken.toUnix(),
      }),
    ])

    return right({
      attendant,
      accessToken,
      refreshToken,
    })
  }
}
