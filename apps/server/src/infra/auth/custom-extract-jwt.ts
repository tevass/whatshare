import { Request } from 'express'
import { JwtFromRequestFunction } from 'passport-jwt'

export class CustomExtractJwt {
  static fromCookie(name: string): JwtFromRequestFunction<Request> {
    return (req) => {
      const hasCookies = !!req.cookies

      return hasCookies ? (req.cookies[name] as string) : null
    }
  }
}
