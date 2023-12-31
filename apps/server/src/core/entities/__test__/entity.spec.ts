import { Entity } from '../entity'
import { UniqueEntityID } from '../unique-entity-id'

interface RawEntityProps {
  isTrue?: boolean
}

class RawEntity extends Entity<RawEntityProps> {
  get isTrue() {
    return this.props.isTrue
  }

  static create(props: RawEntityProps, id?: UniqueEntityID) {
    return new RawEntity(props, id)
  }
}

describe('Entity', () => {
  test('id', () => {
    const entity = RawEntity.create({})

    expect(entity.id).toBeInstanceOf(UniqueEntityID)
  })

  test('set', () => {
    const entity = RawEntity.create({ isTrue: false })

    entity.set({ isTrue: true })
    expect(entity.isTrue).toBe(true)
  })

  test('equals', () => {
    const entity = RawEntity.create({})

    expect(entity.equals(entity)).toBe(true)
  })
})
