import { DateAdapter } from '@/domain/chat/application/adapters/date-adapter'
import dayjs from 'dayjs'

export class FakeDateAdapter implements DateAdapter {
  private dateRef = dayjs()

  fromUnix(timestamp: number): this {
    this.dateRef = dayjs.unix(timestamp)

    return this
  }

  addDays(value: number): this {
    this.dateRef.add(value, 'days')
    return this
  }

  addHours(value: number): this {
    this.dateRef.add(value, 'hours')
    return this
  }

  toDate(): Date {
    return this.dateRef.toDate()
  }

  toUnix(): number {
    return this.dateRef.unix()
  }
}
