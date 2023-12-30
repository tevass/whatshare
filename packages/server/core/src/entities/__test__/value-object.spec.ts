import { ValueObject } from '../value-object'

interface RawValueObjectProps {
  isTrue?: boolean
}

class RawValueObject extends ValueObject<RawValueObjectProps> {
  static create(props: RawValueObjectProps) {
    return new RawValueObject(props)
  }
}

describe('ValueObject (Object Props)', () => {
  test('value', () => {
    const valueObject = RawValueObject.create({
      isTrue: true,
    })

    expect(valueObject.value).toEqual(
      expect.objectContaining({
        isTrue: true,
      }),
    )
  })

  test('equals', () => {
    const valueObject = RawValueObject.create({
      isTrue: true,
    })

    expect(valueObject.equals(valueObject)).toBe(true)
  })
})

class RawSingleValueObject extends ValueObject<string> {
  static create(value: string) {
    return new RawSingleValueObject(value)
  }
}

describe('ValueObject (Single Value)', () => {
  test('value', () => {
    const valueObject = RawSingleValueObject.create('test')

    expect(valueObject.value).toEqual(expect.any(String))
  })

  test('equals', () => {
    const valueObject = RawSingleValueObject.create('test')

    expect(valueObject.equals(valueObject)).toBe(true)
  })
})
