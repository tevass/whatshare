import { Contact } from '@/domain/chat/enterprise/entities/contact'
import { WsContact } from '@whatshare/ws-schemas/entities'

export class ContactPresenter {
  static toWs(contact: Contact): WsContact {
    return {
      id: contact.id.toString(),
      waContactId: contact.waContactId.toString(),
      name: contact.name,
      phone: contact.phone.toString(),
      imageUrl: contact.imageUrl,
      isBusiness: contact.isBusiness,
      isEnterprise: contact.isEnterprise,
      isGroup: contact.isGroup,
      isMyContact: contact.isMyContact,
    }
  }
}
