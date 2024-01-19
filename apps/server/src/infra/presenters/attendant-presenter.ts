import { Attendant } from '@/domain/chat/enterprise/entities/attendant'
import { AttendantProfilePresenter } from './attendant-profile-presenter'

import { HttpAttendant } from '@whatshare/http-schemas/entities'

export class AttendantPresenter {
  static toHttp(attendant: Attendant): HttpAttendant {
    return {
      id: attendant.id.toString(),
      profile: AttendantProfilePresenter.toHttp(attendant.profile),
    }
  }
}
