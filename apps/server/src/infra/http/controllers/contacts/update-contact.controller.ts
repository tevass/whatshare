import { UpdateContactUseCase } from '@/domain/chat/application/use-cases/contacts/update-contact-use-case'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'
import { ZodHttpValidationPipe } from '../../pipes/zod-http-validation-pipe'
import { mongoId } from '@whatshare/shared-schemas'
import {
  updateContactRequestBodySchema,
  UpdateContactRequestBodySchema,
} from '@whatshare/http-schemas/request'

const paramValidationPipe = new ZodHttpValidationPipe(mongoId)
const bodyValidationPipe = new ZodHttpValidationPipe(
  updateContactRequestBodySchema,
)

@Controller('/contacts/:contactId')
export class UpdateContactController {
  constructor(private updateContact: UpdateContactUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Param('contactId', paramValidationPipe) contactId: string,
    @Body(bodyValidationPipe) body: UpdateContactRequestBodySchema,
  ) {
    const { name, number } = body

    const result = await this.updateContact.execute({
      contactId,
      name,
      number,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
