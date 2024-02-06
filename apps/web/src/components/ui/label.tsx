import * as Primitive from '@radix-ui/react-label'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
  {
    variants: {
      variant: {
        error: 'text-destructive',
      },
    },
  },
)

type LabelVariantsProps = VariantProps<typeof labelVariants>
type LabelRef = React.ElementRef<typeof Primitive.Root>

export type LabelProps = Primitive.PrimitiveLabelProps & LabelVariantsProps

const Label = forwardRef<LabelRef, LabelProps>(
  ({ variant, className, ...props }, ref) => (
    <Primitive.Root
      ref={ref}
      className={cn(labelVariants({ variant, className }))}
      {...props}
    />
  ),
)
Label.displayName = Primitive.Root.displayName

export { Label }
