import { DeleteContactUseCase } from '@/domain/chat/application/use-cases/contacts/delete-contact-use-case'
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'
import { ZodHttpValidationPipe } from '../../pipes/zod-http-validation-pipe'
import { mongoId } from '@whatshare/shared-schemas'

const paramValidationPipe = new ZodHttpValidationPipe(mongoId)

@Controller('/contacts/:contactId')
export class DeleteContactController {
  constructor(private deleteContact: DeleteContactUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param('contactId', paramValidationPipe) contactId: string) {
    const result = await this.deleteContact.execute({
      contactId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
