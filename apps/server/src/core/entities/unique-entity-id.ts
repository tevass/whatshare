import objectId from 'bson-objectid'

export class UniqueEntityID {
  private value: string

  constructor(value?: string) {
    this.value = value ?? objectId().toString()
  }

  toString() {
    return this.value
  }

  equals(id: UniqueEntityID) {
    return id.toString() === this.value
  }
}
