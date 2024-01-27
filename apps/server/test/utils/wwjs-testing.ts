import { Time } from '@/infra/utils/time'
import WWJS from 'whatsapp-web.js'

interface WWJSTestingClear {
  client: WWJS.Client
  helper: WWJS.Client
}

export class WWJSTesting {
  static async clearChats({ client, helper }: WWJSTestingClear) {
    const chats = await Promise.all([
      client.getChatById(helper.info.wid._serialized),
      helper.getChatById(client.info.wid._serialized),
    ])

    await Promise.all(
      chats.map(async (chat) => {
        await chat.delete()
        await Time.delay()
      }),
    )
  }
}
