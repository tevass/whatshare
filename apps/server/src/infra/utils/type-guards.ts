export class TypeGuards {
  static isNotUndefined<T>(value?: T): value is NonNullable<typeof value> {
    return typeof value !== 'undefined'
  }
}
