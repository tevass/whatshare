import * as Primitive from '@radix-ui/react-dialog'
import { type ComponentProps } from 'react'

export type DialogPortalProps = ComponentProps<typeof Primitive.Portal>

export const DialogPortal = Primitive.Portal
