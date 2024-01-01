/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */

import {
  ChatEmitParams,
  ChatEmitter,
} from '@/domain/chat/application/emitters/chat-emitter';

export class FakeChatEmitter implements ChatEmitter {
  emit(params: ChatEmitParams): void {}
}
