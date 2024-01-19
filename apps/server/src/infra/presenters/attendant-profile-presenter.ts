import { AttendantProfile } from '@/domain/chat/enterprise/entities/attendant-profile'

import { HttpAttendantProfile } from '@whatshare/http-schemas/entities'

export class AttendantProfilePresenter {
  static toHttp(profile: AttendantProfile): HttpAttendantProfile {
    return {
      id: profile.id.toString(),
      attendantId: profile.attendantId!.toString(),
      displayName: profile.displayName,
      email: profile.email,
      name: profile.name,
    }
  }
}
