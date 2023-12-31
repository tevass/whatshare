export abstract class ValueObject<PropsOrValue> {
  protected props: PropsOrValue

  protected constructor(props: PropsOrValue) {
    this.props = props
  }

  equals(vo: ValueObject<unknown>) {
    if (vo === null || vo === undefined) {
      return false
    }

    if (vo.props === undefined) {
      return false
    }

    if (vo.props !== this.props) {
      return false
    }

    return JSON.stringify(vo.props) === JSON.stringify(this.props)
  }
}
