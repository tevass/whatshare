import { DateAdapter } from '@/domain/chat/application/adapters/date-adapter'
import dayjs from 'dayjs'

export class DayjsAdapter implements DateAdapter {
  private ref = dayjs()

  toDate(): Date {
    return this.ref.toDate()
  }

  fromUnix(timestamp: number): this {
    this.ref = dayjs.unix(timestamp)
    return this
  }
}
