import {
  MessageBody,
  MessageBodyProps,
} from '@/domain/chat/enterprise/entities/value-objects/message-body'
import { faker } from '@faker-js/faker'

export function makeMessageBody(override?: Partial<MessageBodyProps>) {
  return MessageBody.create({
    content: faker.lorem.paragraph(),
    header: faker.person.firstName(),
    ...override,
  })
}
