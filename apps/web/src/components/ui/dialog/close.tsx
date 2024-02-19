import * as Primitive from '@radix-ui/react-dialog'
import { type ComponentProps } from 'react'

export type DialogCloseProps = ComponentProps<typeof Primitive.Close>

export const DialogClose = Primitive.Close