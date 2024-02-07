import { Dialog as Root } from './root'
import { DialogClose } from './close'
import { DialogCloseIcon } from './close-icon'
import { DialogContent } from './content'
import { DialogDescription } from './description'
import { DialogFooter } from './footer'
import { DialogHeader } from './header'
import { DialogOverlay } from './overlay'
import { DialogPortal } from './portal'
import { DialogTitle } from './title'
import { DialogTrigger } from './trigger'

export const Dialog = Object.assign(Root, {
  Close: DialogClose,
  CloseIcon: DialogCloseIcon,
  Content: DialogContent,
  Description: DialogDescription,
  Footer: DialogFooter,
  Header: DialogHeader,
  Overlay: DialogOverlay,
  Portal: DialogPortal,
  Title: DialogTitle,
  Trigger: DialogTrigger,
})

export type { DialogProps } from './root'
export type { DialogCloseProps } from './close'
export type { DialogCloseIconProps } from './close-icon'
export type { DialogContentProps } from './content'
export type { DialogDescriptionProps } from './description'
export type { DialogFooterProps } from './footer'
export type { DialogHeaderProps } from './header'
export type { DialogOverlayProps } from './overlay'
export type { DialogPortalProps } from './portal'
export type { DialogTitleProps } from './title'
export type { DialogTriggerProps } from './trigger'
