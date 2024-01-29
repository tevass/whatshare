import { Time } from '@/infra/utils/time'
import WWJS from 'whatsapp-web.js'

export class WWJSTesting {
  static async clearChat(client: WWJS.Client, chatId: string) {
    const chat = await client.getChatById(chatId)
    await chat.delete()
    await Time.delay()
  }
}
