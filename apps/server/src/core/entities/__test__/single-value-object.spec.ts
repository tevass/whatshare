import { SingleValueObject } from '../single-value-object'

class RawSingleValueObject extends SingleValueObject<string> {
  static create(value: string) {
    return new RawSingleValueObject(value)
  }
}

describe('SingleValueObject', () => {
  test('equals', () => {
    const singleValue = RawSingleValueObject.create('test')

    expect(singleValue.equals(singleValue)).toBe(true)
  })
})
