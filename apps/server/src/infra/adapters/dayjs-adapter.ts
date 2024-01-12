import { DateAdapter } from '@/domain/chat/application/adapters/date-adapter'
import { Injectable } from '@nestjs/common'
import dayjs from 'dayjs'

@Injectable()
export class DayjsAdapter implements DateAdapter {
  private dateRef = dayjs()

  fromUnix(timestamp: number): this {
    this.dateRef = dayjs.unix(timestamp)
    return this
  }

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
