import { Events } from 'whatsapp-web.js'
import { WWJSClient } from './wa-web-js-client'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WWJSListener = (...args: any[]) => Promise<void>

export abstract class WWJSHandler {
  abstract event: Events
  abstract register(waClient: WWJSClient): WWJSListener
}
