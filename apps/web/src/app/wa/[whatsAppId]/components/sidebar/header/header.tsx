import { SquarePen } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Header } from '@/components/ui/header'
import { Select } from '@/components/ui/select'

export function SidebarHeader() {
  return (
    <Header className="px-6 py-4 space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-xl font-semibold tracking-tight scroll-m-20">
          Conversas
        </h4>

        <Button variant="ghost" size="icon">
          <SquarePen className="size-4.5" />
        </Button>
      </div>

      <Select.Root>
        <Select.Trigger>
          <Select.Value placeholder="Selecione..." />
        </Select.Trigger>

        <Select.Content>
          <Select.Item value="1">WhatsApp 1</Select.Item>
        </Select.Content>
      </Select.Root>
    </Header>
  )
}
