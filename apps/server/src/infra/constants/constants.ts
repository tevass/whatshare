const VERSION = '1.0.0'

const COOKIES = {
  prefix: '@whatshare',
  suffix: VERSION,
}

export const CONSTANTS = {
  app: {
    name: 'WhatShare',
    version: VERSION,
  },
  cookies: COOKIES,
  auth: {
    jwt: {
      cookies: {
        access_token: `${COOKIES.prefix}-access-token-${COOKIES.suffix}`,
        refresh_token: `${COOKIES.prefix}-refresh-token-${COOKIES.suffix}`,
      },
      expires: {
        access_token: 15, // minutes
        refresh_token: 7, // days
      },
    },
  },
}

export type Constants = typeof CONSTANTS
