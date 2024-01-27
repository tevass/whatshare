import {
  WAMessageOwnerID,
  WAMessageOwnerIDProps,
} from '@/core/entities/wa-message-owner-id'
import { makeWAEntityID } from './make-wa-entity-id'

export function makeWAMessageOwnerID(
  override: Partial<WAMessageOwnerIDProps> = {},
) {
  const entityId = makeWAEntityID()

  return new WAMessageOwnerID({
    ref: entityId.toString(),
    entityId,
    ...override,
  })
}
