import { Either, left, right } from '@/core/either'
import { Attendant } from '@/domain/chat/enterprise/entities/attendant'
import { ResourceNotFoundError } from '@/domain/shared/application/errors/resource-not-found-error'
import { AttendantsRepository } from '../../repositories/attendants-repository'

interface GetAttendantUseCaseRequest {
  attendantId: string
}

type GetAttendantUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    attendant: Attendant
  }
>

export class GetAttendantUseCase {
  constructor(private attendantsRepository: AttendantsRepository) {}

  async execute(
    request: GetAttendantUseCaseRequest,
  ): Promise<GetAttendantUseCaseResponse> {
    const { attendantId } = request

    const attendant = await this.attendantsRepository.findById(attendantId)
    if (!attendant) {
      return left(new ResourceNotFoundError(attendantId))
    }

    return right({ attendant })
  }
}
