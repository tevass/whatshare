import { Either, left, right } from '@/core/either'
import { Attendant } from '@/domain/chat/enterprise/entities/attendant'
import { ResourceNotFoundError } from '@/domain/shared/application/errors/resource-not-found-error'
import { DateAdapter } from '../../adapters/date-adapter'
import { Encrypter } from '../../cryptography/encrypter'
import { Token } from '../../entities/value-objects/token'
import { AttendantsRepository } from '../../repositories/attendants-repository'

interface RefreshAuthenticateAttendantUseCaseRequest {
  attendantId: string
}

type RefreshAuthenticateAttendantUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    attendant: Attendant
    accessToken: Token
    refreshToken: Token
  }
>

export class RefreshAuthenticateAttendantUseCase {
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

    const expiresAccessToken = this.dateAdapter.addMinutes(15)
    const expiresRefreshAccessToken = this.dateAdapter.addDays(7)

    const [accessTokenValue, refreshTokenValue] = await Promise.all([
      this.encrypter.encrypt(payload, {
        expiresIn: expiresAccessToken.toUnix(),
      }),
      this.encrypter.encrypt(payload, {
        expiresIn: expiresRefreshAccessToken.toUnix(),
      }),
    ])

    const accessToken = Token.create({
      name: 'access-token',
      value: accessTokenValue,
      expiresAt: expiresAccessToken.toDate(),
    })

    const refreshToken = Token.create({
      name: 'refresh-access-token',
      value: refreshTokenValue,
      expiresAt: expiresRefreshAccessToken.toDate(),
    })

    return right({
      attendant,
      accessToken,
      refreshToken,
    })
  }
}
