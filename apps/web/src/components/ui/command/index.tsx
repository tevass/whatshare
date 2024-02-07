import { Command as Root } from './root'
import { CommandDialog } from './dialog'
import { CommandEmpty } from './empty'
import { CommandGroup } from './group'
import { CommandInput } from './input'
import { CommandInputIcon } from './input-icon'
import { CommandInputWrapper } from './input-wrapper'
import { CommandItem } from './item'
import { CommandList } from './list'
import { CommandSeparator } from './separator'
import { CommandShortcut } from './shortcut'

export const Command = Object.assign(Root, {
  Dialog: CommandDialog,
  Empty: CommandEmpty,
  Group: CommandGroup,
  Input: CommandInput,
  InputIcon: CommandInputIcon,
  InputWrapper: CommandInputWrapper,
  Item: CommandItem,
  List: CommandList,
  Separator: CommandSeparator,
  Shortcut: CommandShortcut,
})

export type { CommandProps } from './root'
export type { CommandDialogProps } from './dialog'
export type { CommandEmptyProps } from './empty'
export type { CommandGroupProps } from './group'
export type { CommandInputProps } from './input'
export type { CommandInputIconProps } from './input-icon'
export type { CommandInputWrapperProps } from './input-wrapper'
export type { CommandItemProps } from './item'
export type { CommandListProps } from './list'
export type { CommandSeparatorProps } from './separator'
export type { CommandShortcutProps } from './shortcut'
