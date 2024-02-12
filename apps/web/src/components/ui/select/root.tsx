import { SelectContent } from './content'
import { SelectGroup } from './group'
import { SelectItem } from './item'
import { SelectItemIndicator } from './item-indicator'
import { SelectItemIndicatorIcon } from './item-indicator-icon'
import { SelectItemText } from './item-text'
import { SelectLabel } from './label'
import { SelectScrollDownButton } from './scroll-down-button'
import { SelectScrollIcon } from './scroll-icon'
import { SelectScrollUpButton } from './scroll-up-button'
import { Select as _Select } from './select'
import { SelectSeparator } from './separator'
import { SelectTrigger } from './trigger'
import { SelectTriggerIcon } from './trigger-icon'
import { SelectValue } from './value'
import { SelectViewport } from './viewport'

export const Select = Object.assign(
  {},
  {
    Root: _Select,
    Content: SelectContent,
    Group: SelectGroup,
    Item: SelectItem,
    ItemIndicator: SelectItemIndicator,
    ItemIndicatorIcon: SelectItemIndicatorIcon,
    ItemText: SelectItemText,
    Label: SelectLabel,
    ScrollDownButton: SelectScrollDownButton,
    ScrollIcon: SelectScrollIcon,
    ScrollUpButton: SelectScrollUpButton,
    Separator: SelectSeparator,
    Trigger: SelectTrigger,
    TriggerIcon: SelectTriggerIcon,
    Value: SelectValue,
    Viewport: SelectViewport,
  },
)

export type { SelectContentProps } from './content'
export type { SelectGroupProps } from './group'
export type { SelectItemProps } from './item'
export type { SelectItemIndicatorProps } from './item-indicator'
export type { SelectItemIndicatorIconProps } from './item-indicator-icon'
export type { SelectItemTextProps } from './item-text'
export type { SelectLabelProps } from './label'
export type { SelectScrollDownButtonProps } from './scroll-down-button'
export type { SelectScrollIconProps } from './scroll-icon'
export type { SelectScrollUpButtonProps } from './scroll-up-button'
export type { SelectProps } from './select'
export type { SelectSeparatorProps } from './separator'
export type { SelectTriggerProps } from './trigger'
export type { SelectTriggerIconProps } from './trigger-icon'
export type { SelectValueProps } from './value'
export type { SelectViewportProps } from './viewport'

