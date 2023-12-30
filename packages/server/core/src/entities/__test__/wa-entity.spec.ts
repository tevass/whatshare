import { makeWAEntityID } from '@/factories'
import { WAEntity } from '../wa-entity'
import { WAEntityID } from '../wa-entity-id'

interface RawWAEntityProps {
  isTrue?: boolean
}

class RawWAEntity extends WAEntity<RawWAEntityProps, WAEntityID> {
  get isTrue() {
    return this.props.isTrue
  }

  static create(props: RawWAEntityProps, id: WAEntityID) {
    return new RawWAEntity(props, id)
  }
}

describe('WAEntity', () => {
  test('id', () => {
    const entity = RawWAEntity.create({ isTrue: true }, makeWAEntityID())

    expect(entity.id).toBeInstanceOf(WAEntityID)
  })

  test('set', () => {
    const entity = RawWAEntity.create({ isTrue: false }, makeWAEntityID())

    entity.set({ isTrue: true })
    expect(entity.isTrue).toBe(true)
  })

  test('equals', () => {
    const entity = RawWAEntity.create({ isTrue: false }, makeWAEntityID())

    expect(entity.equals(entity)).toBe(true)
  })
})
