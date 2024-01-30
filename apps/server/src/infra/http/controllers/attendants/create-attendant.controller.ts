import { CreateAttendantUseCase } from '@/domain/chat/application/use-cases/attendants/create-attendant-use-case'
import { AttendantAlreadyExistsError } from '@/domain/chat/application/use-cases/errors/attendant-already-exists-error'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import {
  CreateAttendantRequestBodySchema,
  createAttendantRequestBodySchema,
} from '@whatshare/http-schemas/request'
import { ZodHttpValidationPipe } from '../../pipes/zod-http-validation-pipe'

const bodyValidationPipe = new ZodHttpValidationPipe(
  createAttendantRequestBodySchema,
)

@Controller('/attendants')
export class CreateAttendantController {
  constructor(private createAttendant: CreateAttendantUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: CreateAttendantRequestBodySchema,
  ) {
    const { displayName, email, name, password, whatsAppsIds } = body

    const result = await this.createAttendant.execute({
      displayName,
      email,
      name,
      password,
      whatsAppsIds,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case AttendantAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException()
      }
    }
  }
}
