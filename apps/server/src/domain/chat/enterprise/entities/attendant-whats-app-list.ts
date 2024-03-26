import { WatchedList } from '@/core/entities/watched-list'
import { WhatsApp } from './whats-app'

export class AttendantWhatsAppList extends WatchedList<WhatsApp> {
  compareItems(a: WhatsApp, b: WhatsApp): boolean {
    return a.equals(b)
  }

  static create(initialItems: WhatsApp[]) {
    return new AttendantWhatsAppList(initialItems)
  }
}
