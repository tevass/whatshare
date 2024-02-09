import { FormControl } from './control'
import { FormDescription } from './description'
import { FormErrorMessage } from './error-message'
import { FormField } from './field'
import { FormItem } from './item'
import { FormLabel } from './label'
import { Form as Root } from './root'

export const Form = Object.assign(
  {},
  {
    Root,
    Control: FormControl,
    Description: FormDescription,
    ErrorMessage: FormErrorMessage,
    Field: FormField,
    Item: FormItem,
    Label: FormLabel,
  },
)

export type { FormControlProps } from './control'
export type { FormDescriptionProps } from './description'
export type { FormErrorMessageProps } from './error-message'
export type { FormFieldProps } from './field'
export type { FormItemProps } from './item'
export type { FormLabelProps } from './label'
export type { FormProps } from './root'

