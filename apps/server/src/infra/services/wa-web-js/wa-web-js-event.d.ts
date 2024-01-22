import { Events } from 'whatsapp-web.js'
import { WAWebJSClient } from './wa-web-js-client'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WAWebJSListener = (...args: any[]) => Promise<void>

export abstract class WAWebJSEvent {
  abstract name: Events
  abstract listener(waClient: WAWebJSClient): WAWebJSListener
}
