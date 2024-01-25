export class Text {
  static nonEmptyOrNull(value?: string | null) {
    return value && Text.isNonEmpty(value) ? value : null
  }

  static isNonEmpty(value: string) {
    return !!value.trim()
  }
}
