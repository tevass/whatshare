import { CreateContactUseCase } from '@/domain/chat/application/use-cases/contacts/create-contact-use-case'
import { ContactAlreadyExistsError } from '@/domain/chat/application/use-cases/errors/contact-already-exists-error'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { ZodHttpValidationPipe } from '../../pipes/zod-http-validation-pipe'
import {
  CreateContactRequestBodySchema,
  createContactRequestBodySchema,
} from '@whatshare/http-schemas/request'

@Controller('/contacts')
export class CreateContactController {
  constructor(private createContact: CreateContactUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodHttpValidationPipe(createContactRequestBodySchema))
  async handle(@Body() body: CreateContactRequestBodySchema) {
    const { name, number } = body

    const response = await this.createContact.execute({
      name,
      number,
    })

    if (response.isLeft()) {
      const error = response.value

      switch (error.constructor) {
        case ContactAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException()
      }
    }
  }
}
