import { DateProvider } from '@/domain/chat/application/providers/date-provider'
import dayjs from 'dayjs'

export class FakeDateProvider implements DateProvider {
  private dateRef = dayjs()

  addDays(value: number): this {
    this.dateRef.add(value, 'days')
    return this
  }

  addMinutes(value: number): this {
    this.dateRef.add(value, 'minutes')
    return this
  }

  toDate(): Date {
    return this.dateRef.toDate()
  }

  toUnix(): number {
    return this.dateRef.unix()
  }
}
