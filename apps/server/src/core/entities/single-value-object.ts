export abstract class SingleValueObject<Value> {
  protected _value: Value

  protected constructor(value: Value) {
    this._value = value
  }

  equals(sv: SingleValueObject<unknown>) {
    if (sv === null || sv === undefined) {
      return false
    }

    if (sv._value === undefined) {
      return false
    }

    if (sv._value !== this._value) {
      return false
    }

    return JSON.stringify(sv) === JSON.stringify(this)
  }
}
