import { AuthenticateAttendantUseCase } from '@/domain/chat/application/use-cases/attendants/authenticate-attendant-use-case'
import { WrongCredentialsError } from '@/domain/chat/application/use-cases/errors/wrong-credentials-error'
import { Public } from '@/infra/auth/decorators/public.decorator'
import { EnvService } from '@/infra/env/env.service'
import { AttendantPresenter } from '@/infra/presenters/attendant-presenter'
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
import {
  AuthenticateBodySchema,
  authenticateBodySchema,
} from '@whatshare/http-schemas/request'
import type { Response } from 'express'
import { Cookie } from '../../utils/cookie'
import { ZodHttpValidationPipe } from '../../pipes/zod-http-validation-pipe'

@Controller('/sessions')
@Public()
export class AuthenticateController {
  constructor(
    private env: EnvService,
    private authenticateAttendant: AuthenticateAttendantUseCase,
  ) {}

  @Post()
  @HttpCode(200)
  @UsePipes(new ZodHttpValidationPipe(authenticateBodySchema))
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
      attendant: AttendantPresenter.toHttp(attendant),
    }
  }
}
