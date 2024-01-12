import { Attendant } from '@/domain/chat/enterprise/entities/attendant'
import { AttendantProfileViewModel } from './attendant-profile-view-model'

export class AttendantViewModel {
  static toHttp(attendant: Attendant) {
    return {
      id: attendant.id.toString(),
      profile: AttendantProfileViewModel.toHttp(attendant.profile),
    }
  }
}
