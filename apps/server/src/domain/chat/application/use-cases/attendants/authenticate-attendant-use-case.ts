import { Either, left, right } from '@/core/either'
import { Attendant } from '@/domain/chat/enterprise/entities/attendant'
import { Encrypter } from '../../cryptography/encrypter'
import { HashCompare } from '../../cryptography/hash-compare'
import { Token } from '../../entities/value-objects/token'
import { DateProvider } from '../../providers/date-provider'
import { AttendantsRepository } from '../../repositories/attendants-repository'
import { WrongCredentialsError } from '../errors/wrong-credentials-error'

interface AuthenticateAttendantUseCaseRequest {
  email: string
  password: string
}

type AuthenticateAttendantUseCaseResponse = Either<
  WrongCredentialsError,
  {
    attendant: Attendant
    accessToken: Token
    refreshToken: Token
  }
>

export class AuthenticateAttendantUseCase {
  constructor(
    private attendantsRepository: AttendantsRepository,
    private hashCompare: HashCompare,
    private dateProvider: DateProvider,
    private encrypter: Encrypter,
  ) {}

  async execute(
    request: AuthenticateAttendantUseCaseRequest,
  ): Promise<AuthenticateAttendantUseCaseResponse> {
    const { email, password } = request

    const attendant = await this.attendantsRepository.findByEmail(email)

    if (!attendant || !attendant.password) {
      return left(new WrongCredentialsError())
    }

    const passwordMatch = await this.hashCompare.compare(
      password,
      attendant.password,
    )

    if (!passwordMatch) {
      return left(new WrongCredentialsError())
    }

    const payload = { sub: attendant.id.toString() }

    const expiresAccessToken = this.dateProvider.addMinutes(15)
    const expiresRefreshAccessToken = this.dateProvider.addDays(7)

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
