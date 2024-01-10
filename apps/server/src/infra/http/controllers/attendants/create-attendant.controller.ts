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
import isMongoId from 'validator/lib/isMongoId'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const createAttendantBodySchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  displayName: z.string().min(1),
  password: z.string().min(1),
  whatsAppsIds: z.array(z.string().refine(isMongoId)),
})

type CreateAttendantBodySchema = z.infer<typeof createAttendantBodySchema>

@Controller('/attendants')
export class CreateAttendantController {
  constructor(private createAttendant: CreateAttendantUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAttendantBodySchema))
  async handle(@Body() body: CreateAttendantBodySchema) {
    const { displayName, email, name, password, whatsAppsIds } = body

    const response = await this.createAttendant.execute({
      displayName,
      email,
      name,
      password,
      whatsAppsIds,
    })

    if (response.isLeft()) {
      const error = response.value

      switch (error.constructor) {
        case AttendantAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException()
      }
    }
  }
}
