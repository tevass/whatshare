import { Events } from 'whatsapp-web.js'
import { WAWebJSService } from './wa-web-js'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WAWebJSListener = (...args: any[]) => Promise<void>

export abstract class WAWebJSEvent {
  abstract name: Events
  abstract listener(waService: WAWebJSService): WAWebJSListener
}
