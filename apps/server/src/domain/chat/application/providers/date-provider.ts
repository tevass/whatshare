export abstract class DateProvider {
  // abstract set(date?: Date): this
  abstract addDays(value: number): this
  abstract addMinutes(value: number): this
  abstract toDate(): Date
  abstract toUnix(): number
}
