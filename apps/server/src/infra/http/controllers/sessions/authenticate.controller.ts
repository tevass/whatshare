import { AuthenticateAttendantUseCase } from '@/domain/chat/application/use-cases/attendants/authenticate-attendant-use-case'
import { WrongCredentialsError } from '@/domain/chat/application/use-cases/errors/wrong-credentials-error'
import { Public } from '@/infra/auth/decorators/public.decorator'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  Res,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import type { Response } from 'express'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { AttendantViewModel } from '../../view-models/attendant-view-model'
import { EnvService } from '@/infra/env/env.service'
import { Cookie } from '../../utils/cookie'

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
@Public()
export class AuthenticateController {
  constructor(
    private env: EnvService,
    private authenticateAttendant: AuthenticateAttendantUseCase,
  ) {}

  @Post()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(
    @Body() body: AuthenticateBodySchema,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { email, password } = body

    const result = await this.authenticateAttendant.execute({
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException()
      }
    }

    const { accessToken, refreshToken, attendant } = result.value

    const JWT_COOKIE_NAME = this.env.get('JWT_COOKIE_NAME')
    const JWT_REFRESH_COOKIE_NAME = this.env.get('JWT_REFRESH_COOKIE_NAME')

    const cookieOptions = Cookie.options({
      path: '/',
    })

    response
      .cookie(JWT_COOKIE_NAME, accessToken, cookieOptions)
      .cookie(JWT_REFRESH_COOKIE_NAME, refreshToken, cookieOptions)

    return {
      attendant: AttendantViewModel.toHttp(attendant),
    }
  }
}