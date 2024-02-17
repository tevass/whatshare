import { WatchedList } from '@/core/entities/watched-list'
import { Contact } from './contact'

export class GroupChatContactList extends WatchedList<Contact> {
  compareItems(a: Contact, b: Contact): boolean {
    return a.equals(b)
  }

  static create(initialItems: Contact[]) {
    return new GroupChatContactList(initialItems)
  }
}
