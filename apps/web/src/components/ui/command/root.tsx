import { Command as _Command } from './command'
import { CommandDialog } from './dialog'
import { CommandEmpty } from './empty'
import { CommandGroup } from './group'
import { CommandInput } from './input'
import { CommandItem } from './item'
import { CommandList } from './list'
import { CommandSeparator } from './separator'
import { CommandShortcut } from './shortcut'

export const Command = Object.assign(
  {},
  {
    Root: _Command,
    Dialog: CommandDialog,
    Empty: CommandEmpty,
    Group: CommandGroup,
    Input: CommandInput,
    Item: CommandItem,
    List: CommandList,
    Separator: CommandSeparator,
    Shortcut: CommandShortcut,
  },
)

export type { CommandProps } from './command'
export type { CommandDialogProps } from './dialog'
export type { CommandEmptyProps } from './empty'
export type { CommandGroupProps } from './group'
export type { CommandInputProps } from './input'
export type { CommandItemProps } from './item'
export type { CommandListProps } from './list'
export type { CommandSeparatorProps } from './separator'
export type { CommandShortcutProps } from './shortcut'

