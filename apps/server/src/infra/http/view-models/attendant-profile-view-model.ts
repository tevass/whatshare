import { AttendantProfile } from '@/domain/chat/enterprise/entities/attendant-profile'

export class AttendantProfileViewModel {
  static toHttp(profile: AttendantProfile) {
    return {
      id: profile.id.toString(),
      attendantId: profile.attendantId?.toString(),
      displayName: profile.displayName,
      email: profile.email,
      name: profile.name,
    }
  }
}
