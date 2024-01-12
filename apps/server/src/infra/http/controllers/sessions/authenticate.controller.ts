import { AuthenticateAttendantUseCase } from '@/domain/chat/application/use-cases/attendants/authenticate-attendant-use-case'
import { WrongCredentialsError } from '@/domain/chat/application/use-cases/errors/wrong-credentials-error'
import { Public } from '@/infra/auth/decorators/public.decorator'
import { ConstantsService } from '@/infra/constants/constants.service'
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
import { Cookie } from '../../utils/cookie'
import { AttendantViewModel } from '../../view-models/attendant-view-model'

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
@Public()
export class AuthenticateController {
  constructor(
    private authenticateAttendant: AuthenticateAttendantUseCase,
    private constants: ConstantsService,
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
    const { cookies } = this.constants.get('auth').jwt

    response
      .cookie(
        cookies.access_token,
        accessToken.value,
        Cookie.options({
          path: '/',
          expires: accessToken.expiresAt,
        }),
      )
      .cookie(
        cookies.refresh_token,
        refreshToken.value,
        Cookie.options({
          path: '/',
          expires: refreshToken.expiresAt,
        }),
      )

    return {
      attendant: AttendantViewModel.toHttp(attendant),
    }
  }
}
