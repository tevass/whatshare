import { makeAttendant } from '@/test/factories/make-attendant'
import { makeUniqueEntityID } from '@/test/factories/make-unique-entity-id'
import { InMemoryAttendantsRepository } from '@/test/repositories/in-memory-attendants-repository'
import { GetAttendantUseCase } from '../get-attendant-use-case'

let inMemoryAttendantsRepository: InMemoryAttendantsRepository

let sut: GetAttendantUseCase

describe('GetAttendantUseCase', () => {
  beforeEach(() => {
    inMemoryAttendantsRepository = new InMemoryAttendantsRepository()

    sut = new GetAttendantUseCase(inMemoryAttendantsRepository)
  })

  it('should be able to get attendant', async () => {
    const attendantId = makeUniqueEntityID()

    inMemoryAttendantsRepository.items.push(makeAttendant({}, attendantId))

    const response = await sut.execute({
      attendantId: attendantId.toString(),
    })

    expect(response.isRight()).toBe(true)
  })
})
