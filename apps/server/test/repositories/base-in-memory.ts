import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export class BaseInMemory<Entity extends { id: UniqueEntityID }> {
  items: Entity[] = []

  // async findByIdOrThrow(id: string): Promise<Entity> {
  //   const message = this.items.find((item) => item.id.toString() === id)

  //   if (!message) throw new Error('Entity not found')

  //   return message
  // }

  async findById(id: string): Promise<Entity | null> {
    const message = this.items.find((item) => item.id.toString() === id)

    if (!message) return null

    return message
  }

  async findManyByIds(ids: string[]): Promise<Entity[]> {
    return this.items.filter((item) => ids.includes(item.id.toString()))
  }

  async create(entity: Entity): Promise<void> {
    this.items.push(entity)
  }

  // async createMany(entities: Entity[]): Promise<void> {
  //   this.items.push(...entities)
  // }

  async save(entity: Entity): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === entity.id.toString(),
    )

    this.items[itemIndex] = entity
  }

  // async delete(entity: Entity): Promise<void> {
  //   this.items = this.items.filter((item) => !item.id.equals(entity.id))
  // }
}
