'use client'

import { ScrollAreaCorner } from './corner'
import { ScrollAreaScrollbar } from './scrollbar'
import { ScrollAreaThumb } from './thumb'
import { ScrollAreaViewPort } from './viewport'

import { ScrollArea as Root } from './root'

export const ScrollArea = Object.assign(
  {},
  {
    Root,
    Corner: ScrollAreaCorner,
    Scrollbar: ScrollAreaScrollbar,
    Thumb: ScrollAreaThumb,
    ViewPort: ScrollAreaViewPort,
  },
)

export type { ScrollAreaProps } from './root'
export type { ScrollAreaCornerProps } from './corner'
export type { ScrollAreaScrollbarProps } from './scrollbar'
export type { ScrollAreaThumbProps } from './thumb'
export type { ScrollAreaViewPortProps } from './viewport'
