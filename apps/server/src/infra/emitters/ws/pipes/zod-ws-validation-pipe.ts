import { PipeTransform } from '@nestjs/common'
import { WsException } from '@nestjs/websockets'
import { ZodError, ZodSchema } from 'zod'
import { fromZodError } from 'zod-validation-error'

export class ZodWssValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      const parsedValue = this.schema.parse(value)
      return parsedValue
    } catch (error) {
      if (error instanceof ZodError) {
        throw new WsException({
          message: 'Validation failed',
          errors: fromZodError(error),
        })
      }

      throw new WsException('Validation failed')
    }
  }
}
