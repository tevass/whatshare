import { GetContactUseCase } from '@/domain/chat/application/use-cases/contacts/get-contact-use-case'
import { BadRequestException, Controller, Get, Param } from '@nestjs/common'
import { ZodHttpValidationPipe } from '../../pipes/zod-http-validation-pipe'
import { mongoId } from '@whatshare/shared-schemas'
import { GetContactResponseBodySchema } from '@whatshare/http-schemas/response'
import { ContactPresenter } from '@/infra/presenters/contact-presenter'

const paramValidationPipe = new ZodHttpValidationPipe(mongoId)

@Controller('/contacts/:contactId')
export class GetContactController {
  constructor(private getContact: GetContactUseCase) {}

  @Get()
  async handle(
    @Param('contactId', paramValidationPipe) contactId: string,
  ): Promise<GetContactResponseBodySchema> {
    const result = await this.getContact.execute({
      contactId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { contact } = result.value

    return {
      contact: ContactPresenter.toHttp(contact),
    }
  }
}
