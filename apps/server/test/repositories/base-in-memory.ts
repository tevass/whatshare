import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export class BaseInMemory<Entity extends { id: UniqueEntityID }> {
  items: Entity[] = []

  // async findByIdOrThrow(id: string): Promise<Entity> {
  //   const entity = this.items.find((item) => item.id.toString() === id)

  //   if (!entity) throw new Error('Entity not found')

  //   return entity
  // }

  async findById(id: string): Promise<Entity | null> {
    const entity = this.items.find((item) => item.id.toString() === id)

    if (!entity) return null

    return entity
  }

  async findManyByIds(ids: string[]): Promise<Entity[]> {
    return this.items.filter((item) => ids.includes(item.id.toString()))
  }

  async create(entity: Entity): Promise<void> {
    this.items.push(entity)
  }

  async createMany(entities: Entity[]): Promise<void> {
    this.items.push(...entities)
  }

  async save(entity: Entity): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === entity.id.toString(),
    )

    this.items[itemIndex] = entity
  }

  async saveMany(entities: Entity[]): Promise<void> {
    await Promise.all(entities.map((entity) => this.save(entity)))
  }

  async delete(entity: Entity): Promise<void> {
    this.items = this.items.filter((item) => !item.id.equals(entity.id))
  }
}
