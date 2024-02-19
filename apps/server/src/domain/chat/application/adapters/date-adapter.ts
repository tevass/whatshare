export abstract class DateAdapter {
  abstract toDate(): Date

  abstract fromUnix(timestamp: number): this
}
