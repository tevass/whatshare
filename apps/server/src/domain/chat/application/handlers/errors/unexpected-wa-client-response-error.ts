import { ServiceError } from '@/core/errors/service-error'

export class UnexpectedWAClientResponseError
  extends Error
  implements ServiceError
{
  constructor(identifier: string) {
    super(`Received an unexpected response from WA Client "${identifier}"`)
  }
}
