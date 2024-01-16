import { Encrypter } from '@/domain/chat/application/cryptography/encrypter'
import { HashCompare } from '@/domain/chat/application/cryptography/hash-compare'
import { HashGenerator } from '@/domain/chat/application/cryptography/hash-generator'
import { Module } from '@nestjs/common'
import { BcryptHasher } from './bcrypt-hasher'
import { JwtEncrypter } from './jwt-encrypter'

@Module({
  providers: [
    {
      provide: HashGenerator,
      useClass: BcryptHasher,
    },
    {
      provide: HashCompare,
      useClass: BcryptHasher,
    },
    {
      provide: Encrypter,
      useClass: JwtEncrypter,
    },
  ],
  exports: [HashGenerator, HashCompare, Encrypter],
})
export class CryptographyModule {}
