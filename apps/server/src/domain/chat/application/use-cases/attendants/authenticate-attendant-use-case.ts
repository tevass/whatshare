import { Either, left, right } from '@/core/either'
import { Attendant } from '@/domain/chat/enterprise/entities/attendant'
import { Encrypter } from '../../cryptography/encrypter'
import { HashCompare } from '../../cryptography/hash-compare'
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
    accessToken: string
    refreshToken: string
  }
>

export class AuthenticateAttendantUseCase {
  constructor(
    private attendantsRepository: AttendantsRepository,
    private hashCompare: HashCompare,
    private encrypter: Encrypter,
  ) {}

  async execute(
    request: AuthenticateAttendantUseCaseRequest,
  ): Promise<AuthenticateAttendantUseCaseResponse> {
    const { email, password } = request

    const attendant = await this.attendantsRepository.findByEmail({
      email,
    })

    if (!attendant || !attendant.hasPassword()) {
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
