import type { CookieOptions } from 'express'

const COOKIE_DEFAULT_OPTIONS: CookieOptions = {
  secure: true,
  sameSite: true,
  httpOnly: true,
}

export class Cookie {
  static options(override: CookieOptions = {}): CookieOptions {
    return { ...COOKIE_DEFAULT_OPTIONS, ...override }
  }
}
