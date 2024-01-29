import { Module } from '@nestjs/common'

import { AttendantsModule } from './controllers/attendants/attendants.module'
import { SessionsModule } from './controllers/sessions/sessions.module'
import { ChatsModule } from './controllers/chats/chats.module'
import { MessagesModule } from './controllers/messages/messages.module'

@Module({
  imports: [AttendantsModule, SessionsModule, ChatsModule, MessagesModule],
})
export class HttpModule {}
