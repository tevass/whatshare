/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */

import {
  WhatsAppEmitParams,
  WhatsAppEmitter,
} from '@/domain/chat/application/emitters/whats-app-emitter';

export class FakeWhatsAppEmitter implements WhatsAppEmitter {
  emit(params: WhatsAppEmitParams): void {}
}
