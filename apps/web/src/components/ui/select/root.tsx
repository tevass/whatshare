import { SelectContent } from './content'
import { SelectGroup } from './group'
import { SelectItem } from './item'
import { SelectLabel } from './label'
import { Select as _Select } from './select'
import { SelectSeparator } from './separator'
import { SelectTrigger } from './trigger'
import { SelectValue } from './value'

export const Select = Object.assign(
  {},
  {
    Root: _Select,
    Content: SelectContent,
    Group: SelectGroup,
    Item: SelectItem,
    Label: SelectLabel,
    Separator: SelectSeparator,
    Trigger: SelectTrigger,
    Value: SelectValue,
  },
)

export type { SelectContentProps } from './content'
export type { SelectGroupProps } from './group'
export type { SelectItemProps } from './item'
export type { SelectLabelProps } from './label'
export type { SelectProps } from './select'
export type { SelectSeparatorProps } from './separator'
export type { SelectTriggerProps } from './trigger'
export type { SelectValueProps } from './value'

