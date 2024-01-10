import { HashGenerator } from '@/domain/chat/application/cryptography/hash-generator'
import { Global, Module } from '@nestjs/common'
import { Bcrypt } from './bcrypt'

@Global()
@Module({
  providers: [
    {
      provide: HashGenerator,
      useClass: Bcrypt,
    },
  ],
  exports: [HashGenerator],
})
export class CryptographyModule {}
