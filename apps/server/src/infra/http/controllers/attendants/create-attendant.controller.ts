import { CreateAttendantUseCase } from '@/domain/chat/application/use-cases/attendants/create-attendant-use-case'
import { AttendantAlreadyExistsError } from '@/domain/chat/application/use-cases/errors/attendant-already-exists-error'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import {
  CreateAttendantBodySchema,
  createAttendantBodySchema,
} from '@whatshare/http-schemas/request'
import { ZodHttpValidationPipe } from '../../pipes/zod-http-validation-pipe'

@Controller('/attendants')
export class CreateAttendantController {
  constructor(private createAttendant: CreateAttendantUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodHttpValidationPipe(createAttendantBodySchema))
  async handle(@Body() body: CreateAttendantBodySchema) {
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
