import { DialogClose } from './close'
import { DialogContent } from './content'
import { DialogDescription } from './description'
import { Dialog as _Dialog } from './dialog'
import { DialogFooter } from './footer'
import { DialogHeader } from './header'
import { DialogOverlay } from './overlay'
import { DialogPortal } from './portal'
import { DialogTitle } from './title'
import { DialogTrigger } from './trigger'
import { DialogX } from './x'

export const Dialog = Object.assign(
  {},
  {
    Root: _Dialog,
    Close: DialogClose,
    X: DialogX,
    Content: DialogContent,
    Description: DialogDescription,
    Footer: DialogFooter,
    Header: DialogHeader,
    Overlay: DialogOverlay,
    Portal: DialogPortal,
    Title: DialogTitle,
    Trigger: DialogTrigger,
  },
)

export type { DialogCloseProps } from './close'
export type { DialogContentProps } from './content'
export type { DialogDescriptionProps } from './description'
export type { DialogProps } from './dialog'
export type { DialogFooterProps } from './footer'
export type { DialogHeaderProps } from './header'
export type { DialogOverlayProps } from './overlay'
export type { DialogPortalProps } from './portal'
export type { DialogTitleProps } from './title'
export type { DialogTriggerProps } from './trigger'
export type { DialogXProps } from './x'

