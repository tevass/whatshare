export abstract class WAEntity<Props, ID> {
  private _id: ID
  protected props: Props

  protected constructor(props: Props, id: ID) {
    this.props = props
    this._id = id
  }

  get id() {
    return this._id
  }

  set(newProps: Partial<Props>) {
    this.props = Object.assign({}, this.props, newProps)
  }

  public equals(entity: WAEntity<unknown, unknown>) {
    if (entity === this) {
      return true
    }

    if (entity.id === this._id) {
      return true
    }

    return false
  }
}
