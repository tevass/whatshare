import { DateAdapter } from '@/domain/chat/application/adapters/date-adapter'
import dayjs from 'dayjs'

export class FakeDateAdapter implements DateAdapter {
  private dateRef = dayjs()

  toDate(): Date {
    return this.dateRef.toDate()
  }

  fromUnix(timestamp: number): this {
    this.dateRef = dayjs.unix(timestamp)

    return this
  }
}
