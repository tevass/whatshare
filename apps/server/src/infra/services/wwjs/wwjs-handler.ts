import { Events } from 'whatsapp-web.js'
import { WWJSClient } from './clients/wwjs-client'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WWJSListener = (...args: any[]) => Promise<void>

export interface WWJSHandler {
  event: Events
  register(waClient: WWJSClient): WWJSListener
}
