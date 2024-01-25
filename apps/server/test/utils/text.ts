export class Text {
  static includes(source: string, value: string) {
    const lowedSource = source.toLowerCase()
    const lowedValue = value.toLowerCase()

    return lowedSource === lowedValue || lowedSource.includes(lowedValue)
  }
}
