/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */

import {
  MessageEmitParams,
  MessageEmitter,
} from '@/domain/chat/application/emitters/message-emitter';

export class FakeMessageEmitter implements MessageEmitter {
  emit(params: MessageEmitParams): void {}
}
