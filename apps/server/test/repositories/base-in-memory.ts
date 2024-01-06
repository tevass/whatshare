import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export class BaseInMemory<Entity extends { id: UniqueEntityID }> {
  items: Entity[] = []

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
