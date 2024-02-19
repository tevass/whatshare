import { Either, left, right } from '@/core/either'
import { Attendant } from '@/domain/chat/enterprise/entities/attendant'
import { ResourceNotFoundError } from '@/domain/shared/application/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { Encrypter } from '../../cryptography/encrypter'
import { AttendantsRepository } from '../../repositories/attendants-repository'

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
      this.encrypter.encrypt(payload, {
        expiresIn: '7d',
      }),
    ])

    return right({
      attendant,
      accessToken,
      refreshToken,
    })
  }
}
