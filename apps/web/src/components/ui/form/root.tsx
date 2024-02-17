import { FormContent } from './content'
import { FormControl } from './control'
import { FormDescription } from './description'
import { FormField } from './field'
import { Form as _Form } from './form'
import { FormItem } from './item'
import { FormLabel } from './label'
import { FormMessage } from './message'

export const Form = Object.assign(
  {},
  {
    Root: _Form,
    Content: FormContent,
    Control: FormControl,
    Description: FormDescription,
    Field: FormField,
    Item: FormItem,
    Label: FormLabel,
    Message: FormMessage,
  },
)

export type { FormContentProps } from './content'
export type { FormControlProps } from './control'
export type { FormDescriptionProps } from './description'
export type { FormFieldProps } from './field'
export type { FormProps } from './form'
export type { FormItemProps } from './item'
export type { FormLabelProps } from './label'
export type { FormMessageProps } from './message'

