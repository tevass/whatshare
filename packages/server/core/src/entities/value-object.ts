export abstract class ValueObject<PropsOrValue> {
  protected props: PropsOrValue

  protected constructor(props: PropsOrValue) {
    this.props = props
  }

  get value() {
    return this.props
  }

  equals(vo: ValueObject<unknown>) {
    if (vo === null || vo === undefined) {
      return false
    }

    if (vo.props === undefined) {
      return false
    }

    if (vo.value !== this.value) {
      return false
    }

    return JSON.stringify(vo.props) === JSON.stringify(this.props)
  }
}
