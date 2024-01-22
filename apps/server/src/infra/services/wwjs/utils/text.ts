export class Text {
  static getStringOrNull(text?: string) {
    return text && text.trim() ? text : null
  }
}
