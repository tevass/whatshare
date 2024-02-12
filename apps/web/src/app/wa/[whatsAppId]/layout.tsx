import { Aside } from '@/components/ui/aside'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Check, ChevronsUpDown, SquarePen } from 'lucide-react'
import type { PropsWithChildren } from 'react'

type LayoutProps = Readonly<PropsWithChildren>

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="grid h-full divide-x grid-cols-chat">
      <Aside>
        <header className="px-6 py-4 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xl font-semibold tracking-tight scroll-m-20">
              Conversas
            </h4>

            <Button variant="ghost" size="icon">
              <SquarePen className="h-4.5 w-4.5" />
            </Button>
          </div>

          <Select.Root>
            <Select.Trigger>
              <Select.Value placeholder="Selecione..." />

              <Select.TriggerIcon>
                <ChevronsUpDown />
              </Select.TriggerIcon>
            </Select.Trigger>

            <Select.Content>
              <Select.Viewport>
                <Select.Item value="1">
                  <Select.ItemText>WhatsApp 1</Select.ItemText>

                  <Select.ItemIndicator>
                    <Select.ItemIndicatorIcon>
                      <Check />
                    </Select.ItemIndicatorIcon>
                  </Select.ItemIndicator>
                </Select.Item>
              </Select.Viewport>
            </Select.Content>
          </Select.Root>
        </header>
      </Aside>

      <section>{children}</section>
    </div>
  )
}
