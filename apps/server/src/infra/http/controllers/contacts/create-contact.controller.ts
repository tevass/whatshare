import { CreateContactUseCase } from '@/domain/chat/application/use-cases/contacts/create-contact-use-case'
import { ContactAlreadyExistsError } from '@/domain/chat/application/use-cases/errors/contact-already-exists-error'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import { ZodHttpValidationPipe } from '../../pipes/zod-http-validation-pipe'
import {
  CreateContactRequestBodySchema,
  createContactRequestBodySchema,
} from '@whatshare/http-schemas/request'

const bodyValidationPipe = new ZodHttpValidationPipe(
  createContactRequestBodySchema,
)

@Controller('/contacts')
export class CreateContactController {
  constructor(private createContact: CreateContactUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(@Body(bodyValidationPipe) body: CreateContactRequestBodySchema) {
    const { name, number } = body

    const result = await this.createContact.execute({
      name,
      number,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ContactAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException()
      }
    }
  }
}
