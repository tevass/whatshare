export abstract class DateAdapter {
  // abstract set(date?: Date): this
  abstract addDays(value: number): this
  abstract addHours(value: number): this
  abstract toDate(): Date
  abstract toUnix(): number
  abstract fromUnix(timestamp: number): this
}
