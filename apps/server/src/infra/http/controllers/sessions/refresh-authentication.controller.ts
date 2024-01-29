import { RefreshAuthenticatedAttendantUseCase } from '@/domain/chat/application/use-cases/attendants/refresh-authenticated-attendant-use-case'
import { WrongCredentialsError } from '@/domain/chat/application/use-cases/errors/wrong-credentials-error'
import { Public } from '@/infra/auth/decorators/public.decorator'
import { User } from '@/infra/auth/decorators/user.decorator'
import { RefreshJwtAuthGuard } from '@/infra/auth/guards/refresh-jwt-auth.guard'
import { EnvService } from '@/infra/env/env.service'
import { AttendantPresenter } from '@/infra/presenters/attendant-presenter'
import {
  BadRequestException,
  Controller,
  HttpCode,
  Patch,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
import type { Response } from 'express'
import { RefreshAuthenticationResponseBodySchema } from '@whatshare/http-schemas/response'
import { Cookie } from '../../utils/cookie'

@Public()
@Controller('/sessions/refresh')
@UseGuards(RefreshJwtAuthGuard)
export class RefreshAuthenticationController {
  constructor(
    private env: EnvService,
    private refreshAuthenticatedAttendant: RefreshAuthenticatedAttendantUseCase,
  ) {}

  @Patch()
  @HttpCode(200)
  async handle(
    @User('sub') attendantId: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.refreshAuthenticatedAttendant.execute({
      attendantId,
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
    } as RefreshAuthenticationResponseBodySchema
  }
}
