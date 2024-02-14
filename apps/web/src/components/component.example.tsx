import { forwardRef, type HTMLAttributes } from 'react'

// type ComponentNameRef = ElementRef<typeof Primitive>
type ComponentNameRef = HTMLDivElement

// export type ComponentNameProps = ComponentPropsWithoutRef<typeof Primitive>
export type ComponentNameProps = HTMLAttributes<HTMLDivElement>

export const ComponentName = forwardRef<ComponentNameRef, ComponentNameProps>(
  ({ ...props }, ref) => {
    return <div ref={ref} {...props} />
  },
)
ComponentName.displayName = 'ComponentName'
